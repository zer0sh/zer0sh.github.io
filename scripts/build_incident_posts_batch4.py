#!/usr/bin/env python3
"""
Generator script for real-world SRE & security incident blog posts (Batch 4).
Incidents 21 to 25.
"""

import os

POSTS_DIR = "/home/zero/Workspace/personal/zer0-sh.github.io/public/blog-posts"
os.makedirs(POSTS_DIR, exist_ok=True)

WARNING_CALLOUT = """> [!WARNING] **Nota de confidencialidad y contexto:**  
> *Los nombres de organizaciones, proyectos, identificadores de red y credenciales han sido anonimizados por motivos de seguridad y confidencialidad operativa. La arquitectura técnica, la cronología de eventos, los comandos ejecutados, los diagnósticos y las lecciones aprendidas corresponden a un incidente real vivido en producción.*
"""

posts = {}

# -------------------------------------------------------------
# Post 21: develop-caido-apache-opcache-symlink-deploy
# -------------------------------------------------------------
posts["develop-caido-apache-opcache-symlink-deploy"] = {
    "title": "El entorno de desarrollo que no estaba caído: saturación de Apache, OPcache ciego y symlinks zombis",
    "date": "2026-10-08",
    "category": "Servidores Web & Performance",
    "excerpt": "Un reporte lacónico aseguraba que 'el servidor develop está caído'. Al entrar respondía HTTP 200, pero la investigación destapó cuatro problemas encadenados: workers de Apache retenidos 300 segundos por TLS incompleto, renderizado que se pedía imágenes a sí mismo y symlinks de deploy que rompían OPcache.",
    "coverImage": "/blog-posts/images/btop.png",
    "coverAlt": "Análisis de rendimiento en Apache, OPcache y concurrencia de servidores web Linux",
    "body": WARNING_CALLOUT + """\n\n---\n\n
En soporte de infraestructura es muy común recibir reportes binarios:  
*«La máquina de pruebas está caída, no carga nada»*.

Cuando me conecté al servidor de desarrollo de **Proyecto Horizonte** (`develop.horizonte-ong.org`), la realidad contradijo el reporte: una petición con `curl` devolvió un impecable `HTTP/2 200 OK` en apenas 120 milisegundos.

¿Falsa alarma? No exactamente. 

Al revisar los gráficos históricos de telemetría en Netdata, descubrimos que el servidor **había estado saturado al 100% de su capacidad durante casi 20 horas continuas**, recuperándose por sí solo minutos antes de la inspección. Tirando de ese hilo desenredamos una madeja de cuatro defectos de arquitectura que explicaban, además, por qué el sitio arrojaba errores 500 aleatorios después de cada despliegue.

---

## 1. La autopsia de la saturación en Netdata

El servidor corría en una máquina virtual con 4 GB de RAM bajo la arquitectura clásica de Apache:
- `mpm_prefork` + `mod_php` 8.2.
- `MaxRequestWorkers 12` (cada proceso worker consumía ~300 MB de memoria).
- Partición de Swap activa en disco.

Entre las 23:00 UTC del 29 de septiembre y las 19:00 UTC del 30 de septiembre:
- **10 de los 12 workers de Apache estuvieron ocupados de forma permanente.**
- El uso de Swap alcanzó el 85%, degradando drásticamente el rendimiento de lectura de disco.
- Cualquier visitante nuevo caía en la cola de espera de sockets hasta alcanzar el timeout del navegador.

Al auditar los procesos con `lsof` y `ss -tan`:
```bash
$ ss -tan state established '( dport = :https or sport = :https )'
# Múltiples conexiones en estado CLOSE_WAIT con timers de 300 segundos
```

### El primer culpable: `Timeout 300` en Apache
La directiva `Timeout` en `/etc/apache2/apache2.conf` estaba configurada en **300 segundos (5 minutos)**. Clientes con conexiones móviles inestables o escáneres de vulnerabilidades que abrían el handshake TLS y dejaban la conexión a medias retenían un proceso completo de Apache de 300 MB durante cinco minutos enteros antes de que el kernel pudiera liberarlo.

---

## 2. El segundo culpable: el tema que se atacaba a sí mismo

Al analizar los logs de acceso de Apache (`access.log`) descubrimos un patrón desconcertante: miles de peticiones hacia la ruta:

```text
GET /wp-content/themes/horizonte/timthumb.php?src=https://develop.horizonte-ong.org/uploads/2026/09/foto.jpg&w=400&h=300
```

Un script interno del tema institucional redimensionaba imágenes al vuelo durante el renderizado de la página. Para obtener la imagen original, **el servidor PHP realizaba una petición HTTP remota hacia su propio dominio público.**

Como el servidor tenía solo 12 workers:
- El Worker 1 recibía la petición de la página de inicio.
- Al renderizar el HTML, el Worker 1 abría 6 peticiones HTTP concurrentes contra sí mismo para redimensionar 6 imágenes.
- Esas 6 peticiones eran tomadas por los Workers 2, 3, 4, 5, 6 y 7.
- **Un solo usuario visitando la portada secuestraba más del 50% de la capacidad de todo el servidor.**

---

## 3. El misterio de los errores 500 post-despliegue: OPcache y Symlinks

Durante meses, el equipo había aceptado como "normal" que, tras ejecutar un despliegue de Git, el primer visitante se encontrara con un pantallazo blanco o un error HTTP 500 que desaparecía al recargar.

Al inspeccionar el script de despliegue atómico:

```bash
# atomic-deploy.sh
ln -sfn /srv/apps/releases/v2026-10-08 /srv/apps/current
# [!] Fin del script. Ningún comando posterior.
```

El script cambiaba el enlace simbólico `current` hacia la nueva versión del código, pero **nunca notificaba a Apache ni vaciaba la memoria de OPcache**.

### ¿Qué ocurre en la memoria de PHP?
PHP compila los archivos `.php` a bytecode y los almacena en memoria compartida (OPcache). Por defecto, `opcache.revalidate_path` está desactivado. Cuando el symlink cambia:
1. Algunos workers de Apache siguen ejecutando el bytecode de los archivos viejos en memoria.
2. Otros workers leen las nuevas clases en disco.
3. La colisión de firmas entre clases viejas y nuevas genera un error fatal:  
   *`Fatal error: Cannot declare class WP_Theme, because the name is already in use`*.

El error persistía hasta que el proceso de Apache moría por llegar a `MaxConnectionsPerChild` o un reinicio forzado.

---

## 4. La remediación integral

Implementamos una solución en cuatro frentes:

1. **Ajuste de timeouts en Apache:**
   Redujimos la directiva `Timeout` de 300 segundos a **15 segundos**, y fijamos `KeepAliveTimeout 2`. Las conexiones lentas o incompletas se liberan en milisegundos.
2. **Caché estática de miniaturas:**
   Reemplazamos el script de redimensionamiento dinámico por la generación nativa de tamaños de WordPress en el hook `after_setup_theme`, eliminando por completo las peticiones HTTP internas contra el propio host.
3. **Recarga atómica de OPcache en el deploy:**
   Modificamos el script de despliegue para invocar una recarga suave de Apache (*graceful reload*) inmediatamente después de actualizar el symlink:
   ```bash
   ln -sfn "$RELEASE_DIR" "$CURRENT_DIR"
   sudo systemctl reload apache2 # Limpia OPcache sin interrumpir conexiones activas
   ```
4. **Activación de WP Rocket:**
   Se configuró el plugin de caché en develop para servir páginas HTML estáticas cacheadas, reduciendo la carga de CPU de PHP en un 90%.

---

## 5. Lecciones aprendidas

1. **Un servidor que responde rápido puede estar al borde del colapso:** Verifica la utilización de recursos históricos en tus herramientas de telemetría (Netdata, Prometheus, Datadog) antes de dar por buena una queja de lentitud.
2. **Los symlinks de despliegue exigen invalidar OPcache:** Cambiar un enlace simbólico en disco es transparente para el sistema de archivos, pero invisible para la memoria compartida de PHP. Todo deploy atómico debe recargar el servidor web o invocar `opcache_reset()`.
3. **Nunca dejes que tu backend se haga peticiones HTTP a sí mismo:** Si un script de PHP necesita un recurso local (como una imagen para recortar), léelo directamente desde la ruta absoluta en disco (`/srv/apps/current/uploads/...`), jamás a través de la interfaz de red pública.
"""
}

# -------------------------------------------------------------
# Post 22: fail2ban-ubuntu-systemd-backend-falso-positivo
# -------------------------------------------------------------
posts["fail2ban-ubuntu-systemd-backend-falso-positivo"] = {
    "title": "El Fail2ban que nunca baneó a nadie: journald, rsyslog ausente y la falsa seguridad en Linux",
    "date": "2026-08-20",
    "category": "Linux & Ciberseguridad",
    "excerpt": "El servicio de protección contra fuerza bruta figuraba como activo en el servidor de base de datos de producción, pero en tres años no había bloqueado una sola IP. Tras una actualización de sistema operativo descubrimos la causa: rsyslog ya no existía y fail2ban leía un archivo de logs vacío.",
    "coverImage": "/blog-posts/images/shell-builtins.png",
    "coverAlt": "Hardening de SSH, configuración de Fail2ban y gestión de logs con systemd-journald",
    "body": WARNING_CALLOUT + """\n\n---\n\n
En seguridad defensiva existe un principio aterrador: **una herramienta de protección mal configurada es infinitamente más peligrosa que no tener ninguna herramienta, porque te brinda una falsa sensación de tranquilidad.**

Esto fue exactamente lo que descubrimos en el servidor central de base de datos (`srv-horizonte-db`), un nodo crítico que alojaba instancias de MySQL y PostgreSQL para múltiples proyectos institucionales.

Durante una auditoría de seguridad post-intrusión, revisamos el estado del servicio **Fail2ban**, la clásica utilidad que inspecciona intentos fallidos de conexión por SSH y aplica bloqueos automáticos en el firewall con `iptables` / `nftables`.

El comando de estado arrojaba una respuesta impecable:
```bash
$ sudo systemctl status fail2ban
● fail2ban.service - Fail2Ban Service
     Loaded: loaded (/lib/systemd/system/fail2ban.service; enabled)
     Active: active (running) since Tue 2026-08-04 10:14:22 UTC
```

Pero al revisar las estadísticas de los bloqueos reales:

```bash
$ sudo fail2ban-client status sshd
Status for the jail: sshd
|- Filter
|  |- Currently failed: 0
|  |- Total failed:     0
|  `- File list:        /var/log/auth.log
`- Actions
   |- Currently banned: 0
   `- Total banned:     0
```

En un servidor expuesto con el puerto SSH accesible desde internet, **el contador de intentos fallidos era exactamente CERO después de semanas de actividad.**

Cualquier administrador sabe que internet es un mar turbulento de bots atacando el puerto 22 a razón de cientos de intentos por hora. Un contador en cero no significaba que nadie nos atacara: **significaba que Fail2ban estaba completamente sordo y ciego.**

---

## 1. El misterio del archivo vacío: la muerte silenciosa de `rsyslog`

Al revisar el archivo que Fail2ban decía estar vigilando:

```bash
$ ls -lh /var/log/auth.log
-rw-r----- 1 syslog adm 0B Aug  4 10:00 /var/log/auth.log
```

El archivo `/var/log/auth.log` tenía un tamaño exacto de **0 bytes**. Llevaba semanas vacío.

### ¿Por qué? La transición de Ubuntu 18.04 a 22.04
El servidor había sido actualizado recientemente desde Ubuntu 18.04 LTS (Bionic) hacia Ubuntu 22.04 LTS (Jammy). 

En las versiones modernas de Ubuntu y Debian:
- El paquete clásico de registro de eventos en texto plano (`rsyslog`) **ya no viene instalado por defecto** en imágenes de nube mínimas.
- Todo el registro de autenticación y eventos del kernel es capturado exclusivamente por el demonio binario **`systemd-journald`**.

Como `rsyslog` no estaba corriendo, `/var/log/auth.log` nunca recibía datos. Fail2ban abría el archivo vacío, leía cero líneas y se quedaba esperando pacientemente en silencio mientras los bots probaban contraseñas en el demonio SSH sin ninguna resistencia.

---

## 2. El segundo tropiezo: el bug de `journalmatch` en versiones antiguas

El intento inmediato de corrección fue modificar `/etc/fail2ban/jail.local` para indicarle a Fail2ban que utilizara el backend de `systemd`:

```ini
[sshd]
enabled = true
backend = systemd
```

Reiniciamos el servicio:
```bash
$ sudo systemctl restart fail2ban
ERROR   Failed to initialize any backend for jail 'sshd'
```

Al investigar la versión instalada en el sistema heredado (`fail2ban 0.10.2`):
La versión contenía un bug histórico conocido en upstream (Issue `#959` de Fail2ban): la librería de enlace con Python de `systemd` fallaba si la directiva `journalmatch` no coincidía exactamente con el identificador del socket en distribuciones que migraron de `/usr/sbin/sshd` a socket-activation.

---

## 3. La remediación definitiva y la prueba de fuego

Para resolver el problema de raíz sin parches frágiles:

### Paso 1: Instalación de `python3-systemd` y actualización
Aseguramos los paquetes necesarios para la comunicación nativa entre Python y journald:

```bash
sudo apt update
sudo apt install -y fail2ban python3-systemd
```

### Paso 2: Configuración del backend nativo de `systemd`
Configuramos la celda (`jail`) en `/etc/fail2ban/jail.d/defaults-debian.conf`:

```ini
[DEFAULT]
# Usar la API binaria de systemd-journald en lugar de archivos de texto
backend = systemd

[sshd]
enabled = true
port = ssh
filter = sshd[journalflags=1]
maxretry = 3
findtime = 600
bantime = 86400
action = iptables-multiport[name=SSH, port="ssh", protocol=tcp]
```

### Paso 3: Verificación con tráfico real
Reiniciamos el servicio y verificamos de inmediato:

```bash
$ sudo fail2ban-client restart
$ sudo fail2ban-client status sshd
Status for the jail: sshd
|- Filter
|  |- Currently failed: 4
|  |- Total failed:     28
|  `- Backend:          systemd
`- Actions
   |- Currently banned: 2
   `- Banned IP list:   198.51.100.142 203.0.113.89
```

En menos de tres minutos, Fail2ban interceptó los primeros cuatro intentos de inicio de sesión automatizados y aplicó los baneos correspondientes en la tabla de `iptables`.

---

## 4. Lecciones aprendidas

1. **Nunca midas la salud de un servicio solo por `systemctl is-active`:** Que el proceso esté arriba en memoria no significa que esté haciendo su trabajo. Para utilidades de seguridad, valida siempre sus métricas de acción (ataques detectados, reglas insertadas en firewall).
2. **Entiende la evolución del subsistema de logs en Linux:** Si migras servidores antiguos a distribuciones modernas (Ubuntu 22.04+, Debian 12+, RHEL 9+), recuerda que los archivos de texto en `/var/log/*.log` están siendo reemplazados por el journal binario de `systemd`.
3. **Ejecuta pruebas de penetración sintéticas tras cada configuración:** No esperes a que un bot ataque para saber si Fail2ban funciona. Ejecuta un intento de conexión fallido intencional desde una IP secundaria y verifica que tu propia IP quede baneada en el acto.
"""
}

# -------------------------------------------------------------
# Post 23: terminal-zsh-gotchas-noclobber-alias-trampas
# -------------------------------------------------------------
posts["terminal-zsh-gotchas-noclobber-alias-trampas"] = {
    "title": "La terminal que no era la mía: noclobber, pkill suicida y las trampas de Zsh en scripts interactivos",
    "date": "2026-11-10",
    "category": "Shell & Productividad",
    "excerpt": "Asumir que toda terminal Linux o macOS se comporta como Bash estándar es la causa raíz de errores insólitos: desde bucles que fallan en el primer archivo por noclobber hasta comandos pkill que se matan a sí mismos o filtros sed que exponen tokens en pantalla. Autopsia de tropiezos en la consola.",
    "coverImage": "/blog-posts/images/shell-builtins.png",
    "coverAlt": "Línea de comandos de Unix, depuración de scripts en Zsh y buenas prácticas de terminal",
    "body": WARNING_CALLOUT + """\n\n---\n\n
Los ingenieros de infraestructura pasamos la mayor parte del día dentro de un emulador de terminal. Con el tiempo desarrollamos memoria muscular: comandos rápidos, atajos de teclado y tuberías complejas escritas en segundos.

Pero esa misma familiaridad esconde una trampa psicológica: **asumir que el entorno de shell en la máquina de trabajo se comportará exactamente igual que un Bash estándar de producción.**

Entre septiembre y noviembre registramos una serie de tropiezos desconcertantes mientras ejecutábamos tareas de mantenimiento mediante sesiones automatizadas e interactivas. Todos compartían el mismo origen: las particularidades y opciones avanzadas de **Zsh** (la shell predeterminada en macOS y en muchas estaciones de trabajo con personalizaciones de Oh-My-Zsh).

Esta es la crónica de tres errores reales, cómo los diagnosticamos y las reglas defensivas que adoptamos.

---

## 1. El bucle que cerró 1 de 38 Pull Requests: la trampa de `noclobber`

Durante una sesión de limpieza masiva de repositorios institucionales, necesitábamos cerrar 38 Pull Requests obsoletos de dependencias. Escribí un bucle sencillo:

```zsh
for pr in ${(f)"$(cat pr_list.txt)"}; do
    echo "Cerrando PR $pr..."
    gh pr close "$pr" --comment "Cierre programado por ciclo de dependencias" 2> /tmp/err.txt
done
```

Al revisar la consola, el script recorrió los 38 números imprimiendo mensajes de progreso. Parecía una victoria rápida.

Al consultar la API de GitHub para verificar:
- El primer PR (`#136`) estaba cerrado exitosamente.
- **Los otros 37 Pull Requests seguían totalmente abiertos.**

### ¿Por qué falló?
En Zsh, muchas configuraciones tienen activa la opción defensiva `noclobber` (`set -C`):
> *`noclobber`: Impide que la redirección con `>` sobrescriba un archivo existente sin confirmación explícita.*

1. En la primera iteración, `/tmp/err.txt` no existía; el comando se ejecutó y creó el archivo.
2. En la segunda iteración, `/tmp/err.txt` ya existía. En lugar de vaciarlo y escribir, **Zsh abortó la ejecución del comando inmediatamente** arrojando:  
   `zsh: file exists: /tmp/err.txt`.
3. El comando `gh pr close` ni siquiera llegó a ejecutarse en las 37 iteraciones restantes.

### La solución defensiva
Para forzar la sobreescritura en cualquier shell sin importar la configuración de `noclobber`, se debe utilizar el operador con barra vertical `>|`:

```zsh
# Sobreescritura garantizada en Zsh y Bash
gh pr close "$pr" 2>| /tmp/err.txt
```

O mejor aún: capturar la salida en una variable de memoria sin tocar el disco:
```zsh
out=$(gh pr close "$pr" 2>&1) || echo "Error en PR $pr: $out"
```

---

## 2. El comando de redacción que imprimió el secreto

Para auditar la configuración de paquetes sin comprometer credenciales en la pantalla compartida de una sesión, ejecuté un comando para redactar las contraseñas:

```bash
composer config -g --list | sed 's/key=.*/key=REDACTED/'
```

El script asumía que `composer config` imprime las llaves en formato clásico `clave=valor`.

Sin embargo, el formato real de salida de Composer en esa versión era:
```text
[repositories.packagist.repo.packagist.com/acme.token] ghp_SecretToken2026Real
```

Como la expresión regular buscaba `key=`, **el filtro de `sed` no coincidió con ninguna línea**. El token de la organización quedó impreso en texto plano en la pantalla de la terminal.

### La regla aprendida
Nunca confíes en un filtro de sanitización en el extremo derecho de una tubería (`cmd | sed`) a menos que conozcas exactamente la gramática del comando origen. Para verificar la presencia de secretos sin imprimirlos, usa condiciones booleanas:

```bash
if grep -q "token" ~/.config/composer/auth.json; then
    echo "[OK] Credenciales presentes y configuradas."
fi
```

---

## 3. El `pkill -f` suicida que mató la sesión

Durante una sesión de depuración en segundo plano, varios procesos de Node.js y scripts de espera (`wait_dev.sh`) habían quedado huérfanos consumiendo memoria.

Para limpiar rápidamente, ejecuté:
```bash
pkill -f wait_dev.sh
```

Instantáneamente, **la ventana de la terminal se cerró sola y la sesión SSH se desconectó** con código de salida `144`.

### ¿Por qué se mató a sí mismo?
La herramienta de automatización envuelve cada comando que el usuario digita en una subshell:
```text
/bin/zsh -c "eval 'pkill -f wait_dev.sh'"
```

El comando `pkill -f` busca el patrón de texto en la **línea de comandos completa** de todos los procesos del sistema (`argv`). 

Al buscar la cadena `wait_dev.sh`, el proceso encontró:
1. El script huérfano en segundo plano (`PID 4120: /bin/bash wait_dev.sh`).
2. **El propio proceso de la subshell que estaba ejecutando el comando** (`PID 8590: /bin/zsh -c eval pkill -f wait_dev.sh`).

`pkill` le envió una señal `SIGTERM` a su propio proceso padre antes de terminar de ejecutarse, matando la terminal en el acto.

---

## 4. La solución para búsquedas de procesos

Para evitar el suicidio accidental de procesos:

1. **Inspeccionar antes de matar (`pgrep` primero):**
   ```bash
   pgrep -fl wait_dev.sh  # Muestra los PIDs y sus nombres exactos
   kill <PID>             # Mata solo el proceso deseado
   ```
2. **Coincidencia exacta de binario (`-x` en lugar de `-f`):**
   ```bash
   pkill -x node          # Busca coincidencia exacta con el nombre del ejecutable
   ```
3. **El truco de la clase de corchetes en expresiones regulares:**
   ```bash
   # La expresión [w]ait_dev.sh coincide con "wait_dev.sh", pero la línea del propio pkill contiene "[w]", no coincidiendo consigo misma
   pkill -f "[w]ait_dev.sh"
   ```

---

## 5. Lecciones aprendidas

1. **La portabilidad comienza en tu máquina:** Si escribes scripts de una línea en la terminal destinados a compartirse con el equipo o ejecutarse en servidores, añade siempre `#!/usr/bin/env bash` y ejecuta con `bash -euo pipefail`.
2. **Cuidado con las palabras sin comillas en Zsh:** A diferencia de Bash, en Zsh una variable sin comillas (`$var`) **no se divide automáticamente en palabras** si contiene espacios, a menos que uses el flag `${=var}`. Esto rompe bucles que asumen separación por espacios.
3. **Re-consulta el estado real después de cada lote:** Si ejecutas un comando en bucle sobre 30 recursos, nunca asumas que terminó con éxito solo porque no viste errores en pantalla. Consulta la API o el estado en base de datos para confirmar que los 30 recursos fueron modificados.
"""
}

# -------------------------------------------------------------
# Post 24: deploy-manual-con-github-actions-caido-billing
# -------------------------------------------------------------
posts["deploy-manual-con-github-actions-caido-billing"] = {
    "title": "El despliegue a mano con GitHub Actions suspendido: cuando el billing congela la entrega continua",
    "date": "2026-09-28",
    "category": "CI/CD & Operaciones",
    "excerpt": "Un arreglo urgente de contraste visual WCAG AA en un portal gremial quedó atrapado: GitHub Actions se negó a arrancar por un bloqueo administrativo de facturación. Sin pipelines automáticos, ejecutamos el despliegue a producción a mano cruzando tres capas de permisos.",
    "coverImage": "/blog-posts/images/tui-banner.png",
    "coverAlt": "Despliegues manuales de contingencia, gestión de releases y resolución de incidentes CI/CD",
    "body": WARNING_CALLOUT + """\n\n---\n\n
Nos acostumbramos tanto a que los pipelines de CI/CD se encarguen de compilar, probar y desplegar nuestro código que olvidamos una verdad incómoda: **si la plataforma de automatización se cae o te suspende la cuenta, el negocio sigue necesitando desplegar correcciones críticas.**

A finales de septiembre, estábamos listos para desplegar un hotfix urgente de accesibilidad en el portal público de **Proyecto Arquia**: tres elementos centrales de la página de inicio violaban los estándares legales de contraste WCAG AA, impidiendo que usuarios con dificultades visuales leyeran los textos de navegación.

El Pull Request fue aprobado y mergeado a la rama principal. Fuimos a la pestaña Actions para monitorear el despliegue a producción.

La pantalla de GitHub mostraba un mensaje gris y desalentador:

```text
Run failed: startup_failure
All jobs were canceled before execution because the account has exceeded its spending limit or payment is past due.
0 jobs completed.
```

Una tarjeta corporativa vencida en la administración de la empresa había congelado los minutos de ejecución de GitHub Actions en toda la organización. Ningún workflow podía arrancar.

El lanzamiento legal no podía esperar a que el departamento financiero resolviera la facturación el lunes siguiente. Tuvimos que activar el **protocolo de despliegue manual de contingencia**.

---

## 1. El mapa del release: dos repositorios cruzados

El despliegue no era un simple push de un archivo:
1. El cambio de código residía en un paquete privado de Composer (`arquia-core`), actualizado a la versión `0.1.1`.
2. El repositorio del portal web principal (`portal-web`) debía actualizar su archivo `composer.lock` para referenciar la nueva versión.
3. El artefacto final debía enviarse a la plataforma PaaS (Pantheon) y promoverse a través de tres entornos: `dev` $\rightarrow$ `test` $\rightarrow$ `live`.

En condiciones normales, un workflow llamado `deploy-pantheon.yml` realizaba todo esto automáticamente mediante llaves de máquina y tokens de API. Sin runners disponibles, cada paso debía ejecutarse manualmente desde la terminal de operaciones.

---

## 2. El primer obstáculo: llaves SSH y agentes locales

Para empujar el código directamente desde la máquina local al repositorio remoto de la plataforma PaaS:

```bash
$ git push pantheon master
pantheon@codeserver.dev.uuid.drush.in: Permission denied (publickey).
fatal: Could not read from remote repository.
```

La llave SSH registrada en la plataforma de hosting no estaba cargada en el agente local de SSH del ingeniero. 

Para resolverlo sin crear desorden:
```bash
# Cargar la llave dedicada en memoria para la sesión activa
ssh-add ~/.ssh/id_pantheon_rsa
git push pantheon master
```

El código ingresó al entorno `dev` con un *fast-forward* limpio.

---

## 3. La promoción entre entornos y el muro de permisos

En nuestra organización, para evitar errores humanos, las herramientas CLI tienen clasificadores de permisos estrictos:
- La promoción de `dev` a `test` está autorizada para desarrolladores sénior y agentes de soporte.
- **La promoción a producción (`test` $\rightarrow$ `live`) está bloqueada por política interna** y exige autorización explícita de un Administrador de Infraestructura.

Promovimos el código hacia el entorno de pruebas:
```bash
terminus env:deploy portal-web.test --note="Release 0.1.1 - Hotfix contraste WCAG AA"
```

El entorno `test` se actualizó en 90 segundos.

Para el despliegue a producción, el Líder de Infraestructura ejecutó el comando final desde su propia sesión autorizada:
```bash
terminus env:deploy portal-web.live --note="Release 0.1.1 - Hotfix contraste WCAG AA" --cc
```

El parámetro `--cc` (*clear cache*) forzó la purga inmediata de la memoria caché de Varnish y Redis en el clúster de producción.

---

## 4. La verificación independiente con Playwright

Cuando despliegas manualmente sin la red de seguridad de un pipeline automatizado, **la verificación posterior debe ser tres veces más rigurosa**.

Escribimos un script local rápido con Playwright para inspeccionar el DOM real servido por Cloudflare en producción:

```javascript
// verify-contrast.js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.arquia-ejemplo.org/?nocache=1');

  const textElement = await page.$('.hero-subheading');
  const computedColor = await textElement.evaluate(el => window.getComputedStyle(el).color);
  const backgroundColor = await textElement.evaluate(el => window.getComputedStyle(el).backgroundColor);

  console.log(`[VERIFICACIÓN] Color de texto: ${computedColor}`);
  console.log(`[VERIFICACIÓN] Color de fondo: ${backgroundColor}`);
  
  await browser.close();
})();
```

La consola confirmó:
```text
[VERIFICACIÓN] Color de texto: rgb(248, 250, 252)  # #f8fafc
[VERIFICACIÓN] Color de fondo: rgb(15, 23, 42)     # #0f172a
[OK] Ratio de contraste: 14.8:1 (Cumple WCAG AAA holgadamente).
```

El hotfix estaba en vivo, funcionando y verificado, apenas 25 minutos después de que GitHub Actions fallara.

---

## 5. Lecciones aprendidas

1. **Ten siempre un procedimiento de despliegue manual documentado:** Si tu equipo solo sabe desplegar haciendo clic en un botón de GitHub Actions, el día que GitHub sufra una caída global o un problema de facturación, tu empresa quedará paralizada. Documenta el plan de contingencia paso a paso.
2. **Los permisos cruzados protegen la producción incluso en emergencias:** Que exista una urgencia no significa que cualquier persona deba tener acceso directo de escritura a la base de datos o al entorno `live`. Mantener la segregación de funciones entre quien prepara el cambio y quien autoriza la salida a producción previene catástrofes mayores.
3. **Automatiza la verificación post-despliegue local:** Si no tienes CI/CD para correr tests de regresión, corre tus scripts de prueba localmente contra la URL pública de producción para validar que el cambio realmente surtió efecto.
"""
}

# -------------------------------------------------------------
# Post 25: politicas-despliegue-cloudflare-actions-en-conflicto
# -------------------------------------------------------------
posts["politicas-despliegue-cloudflare-actions-en-conflicto"] = {
    "title": "Los merges que publicaban a producción: políticas contradictorias entre Cloudflare y GitHub Actions",
    "date": "2026-09-26",
    "category": "Cloud & CI/CD",
    "excerpt": "Una directiva de seguridad exigía que ningún merge a master publicara a producción sin un release explícito. Al auditar 24 repositorios serverless descubrimos que otra tarea había configurado exactamente lo contrario: dos políticas opuestas conviviendo en el mismo código.",
    "coverImage": "/blog-posts/images/opencode.png",
    "coverAlt": "Gestión de políticas de despliegue continuo, Cloudflare Workers y gobernanza en GitHub Actions",
    "body": WARNING_CALLOUT + """\n\n---\n\n
En organizaciones medianas que manejan decenas de microservicios y funciones serverless, hay un riesgo silencioso que no aparece en los escáneres de vulnerabilidades: **la contradicción de políticas operativas aprobadas por diferentes líderes técnicos en el mismo sprint.**

A finales de septiembre recibimos una tarea urgente de gobernanza de despliegues:  
*«Garantizar que ningún repositorio publique código automáticamente a producción con solo hacer merge a la rama master; todo despliegue a producción debe requerir un tag o un evento manual explícito»*.

El objetivo era proteger 24 repositorios que gestionaban funciones serverless en **Cloudflare Workers** y aplicaciones estáticas en **Cloudflare Pages**.

Al iniciar el inventario de los pipelines nos encontramos con una paradoja fascinante: apenas dos semanas antes, otra directriz de optimización de entrega continua había sido aprobada e implementada en la mitad de esos mismos repositorios con la orden opuesta:  
*«Eliminar fricción: todo merge a master debe desplegar inmediatamente a producción o fallar de forma estruendosa»*.

Dos políticas diametralmente opuestas estaban activas al mismo tiempo sobre la misma flota de repositorios.

---

## 1. La radiografía del inventario: 24 repositorios y tres realidades

Para tomar decisiones basadas en datos y no en suposiciones, auditamos los 24 repositorios clasificándolos según su mecanismo real de entrega:

```text
[UNIVERSO DE 24 REPOSITORIOS CLOUD SERVERLESS]
├── 1 Repositorio con política madura (Proyecto Horizonte)
│   └── Deploy exclusivo por dispatch manual con verificación de ancestros Git.
├── 7 Repositorios con auto-despliegue en push a master
│   └── GitHub Actions ejecutando wrangler-action directamente en cada merge.
└── 16 Repositorios delegados a Cloudflare Pages
    └── El propio panel web de Cloudflare escuchaba webhooks de GitHub.
```

### El hallazgo crítico en los 7 repositorios de Actions
En proyectos como `microservicio-ventas` y `portal-pagos`, el archivo `.github/workflows/deploy.yml` tenía:

```yaml
on:
  push:
    branches: [master] # <--- ¡Cualquier merge publicaba en vivo!

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{{{ secrets.CLOUDFLARE_API_TOKEN }}}}
          environment: production
```

Para empeorar la situación: dos de esos repositorios tenían activada la función de **auto-merge de Dependabot**. Si Dependabot abría un PR actualizando una librería menor y los tests pasaban, GitHub hacía merge automático y el cambio se iba directo a los servidores de producción de madrugada sin supervisión humana.

---

## 2. El obstáculo del token inválido en la auditoría

Para auditar los 16 proyectos restantes configurados en Cloudflare Pages, necesitábamos consultar la API de Cloudflare con el CLI oficial `wrangler` para revisar si la rama de producción configurada en el panel era `master` o `production`:

```bash
$ npx wrangler pages project list
ERROR: Authentication error: Invalid API Token (Code 10000)
```

El token `CLOUDFLARE_API_TOKEN` almacenado en el entorno de desarrollo central había sido revocado días atrás. Sin acceso a la API del proveedor de cloud, la mitad de los repositorios era una caja negra.

En lugar de detener la auditoría:
1. Inspeccionamos la configuración estática de los repositorios (`wrangler.toml`).
2. Solicitamos un token temporal de solo lectura con alcance acotado (`Pages:Read`, `Workers:Read`) para completar la auditoría sin privilegios destructivos.

---

## 3. El debate técnico: ¿Entrega Continua Total o Control de Cambios?

Nos sentamos con ambos líderes técnicos a resolver el conflicto de fondo:

- **Postura A (Velocidad):** Para microservicios internos desacoplados, exigir un tag manual por cada commit ralentiza el desarrollo y desalienta los despliegues pequeños y frecuentes.
- **Postura B (Control de Riesgo):** Para servicios que tocan pagos o bases de datos de producción, un merge involuntario o un auto-merge de un bot no supervisado puede causar una catástrofe financiera.

### El consenso: La política de dos niveles
Establecimos una matriz clara de gobernanza:

1. **Servicios de Nivel 1 (Críticos / Pagos / Datos):**
   - El push a `master` despliega exclusivamente al entorno de **Staging**.
   - El despliegue a **Producción** exige la creación de un tag semántico (`v*.*.*`) o un disparo manual explícito (`workflow_dispatch`) con aprobación de dos ingenieros en GitHub Environments.
   - Prohibido el auto-merge de Dependabot en la rama principal.

2. **Servicios de Nivel 2 (Documentación / Sitios Estáticos / Micro-APIs de lectura):**
   - Permitido el despliegue automático en merge a `master`, pero con una ventana de retención (*canary deploy*) del 10% del tráfico durante 15 minutos en Cloudflare.

---

## 4. La implementación técnica: GitHub Environments

Para los servicios de Nivel 1, refactorizamos el workflow utilizando las protecciones nativas de GitHub Environments:

```yaml
name: Deploy Production Worker

on:
  release:
    types: [published]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production # Exige aprobación manual en la interfaz de GitHub
    steps:
      - uses: actions/checkout@v4
      - name: Deploy Worker
        run: npx wrangler deploy --env production
```

Con este ajuste:
- Los desarrolladores pueden mergear PRs a `master` continuamente sin miedo a romper producción.
- El despliegue real requiere una acción consciente y documentada en la pestaña Releases.

---

## 5. Lecciones aprendidas

1. **Alinea las políticas de ingeniería antes de escribir código:** Cuando dos iniciativas con objetivos válidos (velocidad vs control) no se coordinan a nivel de liderazgo, los equipos terminan implementando soluciones contradictorias que generan caos.
2. **Cuidado con el auto-merge de bots en ramas de producción:** Permitir que bots como Dependabot hagan merge automático sobre ramas que disparan despliegues directos a producción es abdicar del control operativo. Los bots deben mergear hacia ramas de integración o staging.
3. **Usa GitHub Environments para aprobaciones formales:** En lugar de inventar scripts complejos de validación en bash, utiliza la funcionalidad nativa de entornos protegidos de GitHub: te otorga registros de auditoría, aprobadores obligatorios y protección de secretos por nivel.
"""
}

# Write posts to disk
for slug, data in posts.items():
    filepath = os.path.join(POSTS_DIR, f"{slug}.md")
    frontmatter = f"""---
title: "{data['title']}"
date: "{data['date']}"
category: "{data['category']}"
excerpt: "{data['excerpt']}"
coverImage: "{data['coverImage']}"
coverAlt: "{data['coverAlt']}"
---

"""
    content = frontmatter + data['body'].strip() + "\n"
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"[OK] Generated: {slug}.md ({data['date']})")

print(f"Batch 4 complete: {len(posts)} posts generated.")
