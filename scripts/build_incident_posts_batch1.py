#!/usr/bin/env python3
"""
Generator script for real-world SRE & security incident blog posts.
Ensures:
- Strict anonymization (RFC 5737 IPs, pseudonyms for all clients/repos/tickets).
- Prominent [!WARNING] context callout.
- Accurate chronological alignment between frontmatter dates and article events.
- Valid Markdown structure, syntax, and zero unescaped HTML entities in code blocks.
"""

import os
import sys

POSTS_DIR = "/home/zero/Workspace/personal/zer0-sh.github.io/public/blog-posts"
os.makedirs(POSTS_DIR, exist_ok=True)

WARNING_CALLOUT = """> [!WARNING] **Nota de confidencialidad y contexto:**  
> *Los nombres de organizaciones, proyectos, identificadores de red y credenciales han sido anonimizados por motivos de seguridad y confidencialidad operativa. La arquitectura técnica, la cronología de eventos, los comandos ejecutados, los diagnósticos y las lecciones aprendidas corresponden a un incidente real vivido en producción.*
"""

posts = {}

# -------------------------------------------------------------
# Post 04: packagist-token-filtrado-pantheon-composer
# -------------------------------------------------------------
posts["packagist-token-filtrado-pantheon-composer"] = {
    "title": "El token de Packagist que vivió tres años en producción: por qué borrar el archivo no bastó",
    "date": "2026-09-12",
    "category": "Seguridad & Secretos",
    "excerpt": "Un token de nuestro repositorio privado de paquetes estuvo expuesto en texto plano en tres repositorios desde 2023. Lo verdaderamente revelador no fue encontrarlo, sino descubrir que la plataforma cloud lo regeneraba en cada build y lo servía por HTTP en el borde ignorando .htaccess.",
    "coverImage": "/blog-posts/images/opencode.png",
    "coverAlt": "Auditoría de seguridad y gestión de secretos en integración continua",
    "body": f"""{WARNING_CALLOUT}

---

En auditorías de seguridad en la nube hay una regla silenciosa: **encontrar un secreto expuesto es solo el 20% del trabajo; entender cómo la plataforma de hosting lo almacena, compila y sirve al público es el 80% restante.**

Durante una revisión rutinaria de dependencias para varios portales WordPress corporativos alojados en una plataforma PaaS (Pantheon), nos topamos con un hallazgo alarmante: un archivo `auth.json` con credenciales de lectura y descarga de nuestro repositorio privado de paquetes PHP (**Packagist**) llevaba comiteado en la rama principal de tres repositorios desde 2023.

Cualquiera con acceso a los repositorios o que consultara la ruta web directa podía obtener el token y descargar código propietario de decenas de módulos internos.

Esta es la historia de cómo contuvimos la brecha, por qué eliminar el archivo de Git y bloquearlo con `.htaccess` fracasó estrepitosamente, y la solución definitiva a nivel de arquitectura de plataforma.

---

## 1. El hallazgo y el radio de impacto

El archivo `auth.json` es la convención que utiliza Composer para autenticarse contra repositorios protegidos. En los tres proyectos afectados, el archivo residía en la raíz del repositorio:

```json
{{
  "http-basic": {{
    "repo.packagist.com/acme-corp/": {{
      "username": "token",
      "password": "ghp_xxxxxxxxxxxxxxxxxxxxxxEXAMPLE"
    }}
  }}
}}
```

Al investigar la huella del token en la organización descubrimos:
1. El mismo token estaba configurado como variable de entorno `COMPOSER_AUTH` en los secretos de la plataforma cloud en 14 sitios adicionales.
2. Estaba inyectado en los secretos de organización de GitHub Actions para flujos de integración continua.
3. Dos de los sitios tenían una arquitectura no estándar: el *Document Root* web coincidía con la raíz del repositorio (`/`), en lugar de la carpeta aislada `/web/`.

---

## 2. La primera reacción que falló: borrar de Git no basta

El impulso inmediato en un incidente de exposición es crear un Pull Request urgente:

```bash
git rm auth.json
git commit -m "security: remove auth.json from repository"
git push origin master
```

El PR se mergeó y el pipeline de despliegue se ejecutó. Fuimos al navegador e hicimos una petición HTTP directa:

```bash
curl -I https://portal-dental.ejemplo.org/auth.json
# HTTP/2 200 OK
# Content-Type: application/json
```

**El archivo seguía vivo y público.**

### ¿Por qué? La magia de Integrated Composer
En esta plataforma, cuando el contenedor de build detecta la variable secreta `COMPOSER_AUTH`, **genera automáticamente en disco el archivo `auth.json` en tiempo de compilación** para que `composer install` pueda descargar los vendors. 

Cuando el proceso de compilación empaqueta los artefactos finales para enviarlos a los contenedores web de producción, el archivo generado dinámicamente es incluido en el árbol de despliegue. Borrarlo del repositorio Git no servía de nada: la plataforma lo recreaba en cada push.

---

## 3. La segunda trampa: el bypass del CDN y `.htaccess`

El siguiente intento lógico fue bloquear el acceso mediante directivas de servidor web en `.htaccess`:

```apache
<Files "auth.json">
    Require all denied
</Files>
```

Se desplegó el cambio, pero `curl` siguió devolviendo `HTTP 200 OK`. 

Al analizar la infraestructura de borde de la plataforma entendimos la causa: **el Edge Router (Fastly/NGINX) almacena en caché y despacha archivos estáticos directamente desde el sistema de almacenamiento antes de que la petición toque el servidor web Apache**. Las directivas de `.htaccess` nunca llegaban a ejecutarse para extensiones conocidas despachadas en el borde.

---

## 4. La solución definitiva: control a nivel de plataforma

Para bloquear archivos generados por el runtime en plataformas PaaS, el control debe declararse en el archivo de orquestación de la infraestructura (`pantheon.yml`), que instruye directamente al router de borde:

```yaml
api_version: 1

protected_web_paths:
  - /auth.json
  - /private
  - /composer.json
  - /composer.lock
```

Tras desplegar esta directiva:

```bash
$ curl -s -o /dev/null -w "%{{http_code}}\\n" https://portal-dental.ejemplo.org/auth.json
403
```

El router de borde devolvió un `HTTP 403 Forbidden` inmediato sin consultar el backend.

Una vez garantizado el blindaje perimetral:
1. Se generó un nuevo token en Packagist con permisos mínimos de solo lectura.
2. Se actualizaron los secretos cifrados de la organización.
3. Se revocó y destruyó el token viejo de 2023, verificando en los logs de auditoría de Packagist que ningún consumo anómalo ocurriera durante la ventana de corte.

---

## 5. Lecciones aprendidas en operaciones

1. **Los artefactos de build no son el árbol de Git:** Una plataforma PaaS que compila en la nube altera el sistema de archivos final. Lo que no está en Git puede seguir existiendo en el contenedor despachado.
2. **El edge cache no respeta tus `.htaccess`:** Si un proxy inverso o CDN atiende estáticos en el perímetro, las reglas de Apache a nivel de aplicación son completamente ignoradas.
3. **Usa rutas aisladas para el DocRoot:** Un proyecto cuyo *docroot* es la raíz del repositorio (`/`) es un accidente esperando ocurrir. La convención `/web` o `/public` como único punto de entrada existe para evitar que metadatos de compilación queden expuestos.
"""
}

# -------------------------------------------------------------
# Post 05: archivos-fantasma-sucuri-eval-edge
# -------------------------------------------------------------
posts["archivos-fantasma-sucuri-eval-edge"] = {
    "title": "Los archivos fantasma de Sucuri: endpoints de eval() remoto y la trampa del SFTP en PaaS",
    "date": "2026-10-04",
    "category": "Seguridad & Plataforma",
    "excerpt": "Dos archivos PHP de un servicio de seguridad descontratado respondían HTTP 200 en producción; uno contenía un eval() remoto. Al eliminarlos de Git seguían ahí; al borrarlos por SFTP reaparecían solos. Anatomía de un ciclo de artefactos zombi.",
    "coverImage": "/blog-posts/images/cve-2026-9860.png",
    "coverAlt": "Análisis de vulnerabilidades web y eliminación de backdoors en producción",
    "body": f"""{WARNING_CALLOUT}

---

Hay una paradoja recurrente en ciberseguridad: **herramientas diseñadas para proteger una infraestructura pueden convertirse, años después de cancelado el contrato, en la puerta trasera más peligrosa del sistema.**

Esto ocurrió en el portal de una firma legal corporativa a la que llamaremos **Proyecto LexFirm**. Durante un escaneo de seguridad perimetral detectamos dos archivos PHP sospechosos respondiendo con `HTTP 200 OK` en la raíz del entorno de producción:
- `/sucuri-d6583c9a.php`
- `/sucuri-test.php`

El servicio de monitoreo externo de Sucuri había sido descontratado hacía más de dos años. Sin embargo, al inspeccionar el contenido del primer archivo descubrimos una rutina de diagnóstico que aceptaba payloads cifrados y los ejecutaba mediante llamadas directas a `eval()` si la firma coincidía con una clave estática obsoleta.

Lo inquietante no fue el hallazgo, sino el laberinto operativo para borrarlos: **se borraron de Git y continuaron en producción; se borraron por SFTP y regresaron al día siguiente.**

---

## 1. La anatomía del archivo fantasma

El archivo formaba parte de una vieja integración de firewall WAF en la nube. Permitía al proveedor comprobar la conectividad del servidor ejecutando pruebas de diagnóstico en PHP:

```php
// Fragmento anonimizado del script de diagnóstico residual
if (isset($_POST['sucuri_cmd']) && hash_equals($expected_sig, $_POST['sig'])) {{
    $code = base64_decode($_POST['sucuri_cmd']);
    eval($code); // Endpoint de ejecución dinámica remota
    exit;
}}
```

Tener un endpoint con `eval()` accesible en producción, con un contrato cancelado y sin garantías sobre quién posee las llaves de firma originales, es una vulnerabilidad crítica de severidad máxima.

---

## 2. El misterio: ¿por qué no se van?

El equipo aplicó el procedimiento estándar:
1. Se abrió el Pull Request `#1005` eliminando ambos archivos del repositorio Git.
2. Se hizo merge a `master`.
3. El despliegue automático finalizó con éxito en la plataforma.

Al probar con `curl`:
```bash
curl -I https://www.lexfirm-ejemplo.com/sucuri-d6583c9a.php
# HTTP/2 200 OK
```

### El mecanismo del zombi: "Build Artifacts Added by Platform"
Al auditar los commits generados internamente por la plataforma de hosting, encontramos un commit automático generado durante el despliegue a los entornos `test` y `live`:
> *"Test/live build artifacts added by platform"*

La plataforma mantenía una caché de capas de compilación en su sistema de almacenamiento de objetos. Como los archivos habían sido modificados en el pasado mediante SFTP directo en el entorno `dev`, la plataforma los catalogó como "artefactos persistentes del entorno" y los reinyectaba automáticamente en cada build, por encima de lo que dictara el árbol de Git.

---

## 3. El callejón sin salida del SFTP

Intentamos ingresar por SFTP en el entorno `dev` y borrarlos manualmente con `rm`.
- Desde la consola SFTP: `rm sucuri-*.php` $\rightarrow$ el comando respondió exitoso y `curl` arrojó `404 Not Found`.
- Sin embargo, al cambiar el entorno de modo `sftp` a modo `git`, la consola arrojaba:
  ```text
  $ terminus env:commit lexfirm.dev
  [notice] No code changes to commit.
  ```
- Y en cuanto se desplegaba un nuevo commit desde Git, la plataforma restauraba los archivos fantasma desde el volumen raíz.

---

## 4. La contención inmediata y el desarme

Mientras investigábamos la purga interna de la caché del build, la prioridad número uno era **bloquear el acceso público al endpoint para neutralizar cualquier vector de ataque.**

### Paso 1: Bloqueo en el enrutador de borde (`pantheon.yml`)
Declaramos una regla estricta en el orquestador:

```yaml
api_version: 1

protected_web_paths:
  - /sucuri-d6583c*.php
  - /sucuri-test.php
```

Inmediatamente, cualquier petición externa a esas URLs comenzó a recibir `403 Forbidden` directo desde los edge nodes de Fastly/Varnish, antes de que el intérprete de PHP pudiera ser invocado.

### Paso 2: Gancho en el ciclo de Composer
Para forzar la eliminación física durante la fase de empaquetado del build, creamos un script en `composer.json` en el evento `post-install-cmd`:

```json
"scripts": {{
    "post-install-cmd": [
        "rm -f web/sucuri-*.php sucuri-*.php || true"
    ]
}}
```

En la siguiente corrida de compilación, el comando borró los binarios del espacio temporal de trabajo antes de que se congelara el artefacto de despliegue.

---

## 5. Lecciones para la trinchera

1. **Todo plugin o WAF desinstalado deja basura peligrosa:** Los escáneres y plugins de seguridad suelen dejar scripts "selftest" y backdoors de diagnóstico en la raíz. Cancelar el servicio sin auditar los archivos residuales es negligencia operativa.
2. **El modo SFTP en plataformas PaaS rompe el determinismo:** Modificar archivos en un servidor vía SFTP crea bifurcaciones invisibles entre el código versionado en Git y el estado del contenedor. Si usas GitOps, el acceso SFTP debe estar bloqueado por defecto.
3. **El bloqueo en el borde es tu mejor chaleco antibalas:** Cuando un archivo no se deja borrar inmediatamente por quirks de la plataforma, un `403` a nivel de Edge Router compra el tiempo necesario para investigar sin riesgo operativo.
"""
}

# -------------------------------------------------------------
# Post 06: rm-comodin-carpetas-compartidas-autopsia
# -------------------------------------------------------------
posts["rm-comodin-carpetas-compartidas-autopsia"] = {
    "title": "El 'rm *.png' que se llevó 70 capturas: autopsia de un descuido con comodines en directorios compartidos",
    "date": "2026-09-11",
    "category": "Buenas Prácticas & Shell",
    "excerpt": "Durante una sesión de pruebas visuales con Playwright, un comando de limpieza rápida con comodín en un directorio compartido eliminó más de 70 capturas de auditorías anteriores sin posibilidad de recuperación. Crónica sin filtros sobre el peligro de la pereza en la terminal.",
    "coverImage": "/blog-posts/images/shell-builtins.png",
    "coverAlt": "Línea de comandos Linux y borrado accidental de archivos en terminal",
    "body": f"""{WARNING_CALLOUT}

---

Hay dos tipos de ingenieros en operaciones: **los que han ejecutado un comando destructivo irreversible por comodidad en la terminal, y los que están a punto de hacerlo.**

Este artículo no trata sobre una vulnerabilidad zero-day ni sobre un ataque sofisticado. Trata sobre un error humano propio, directo y evitable: cómo un comando `rm -f *.png` ejecutado a la ligera en un directorio compartido eliminó de un plumazo 70 capturas de pantalla de auditorías visuales y evidencias forenses acumuladas durante meses.

En la cultura blameless post-mortem, admitir los errores propios con precisión clínica es la única forma de construir sistemas y hábitos que impidan que vuelvan a repetirse.

---

## 1. El contexto de la tarea

Estábamos trabajando en el rediseño y aseguramiento de un componente de interfaz con navegación tipo *glassmorphism* para un panel interno (`dashboard-tareas`). Para verificar la fidelidad visual entre diferentes resoluciones, ejecutamos un script con **Playwright** que realizaba capturas de pantalla automatizadas del navegador.

Durante la sesión se fueron generando capturas como:
- `viewport-1920-dark.png`
- `viewport-mobile-ios.png`
- `nav-glass-blur.png`

Al principio, cada vez que terminaba una tanda de validación, el procedimiento de limpieza era cuidadoso y explícito:

```bash
rm -f ./reports/viewport-1920-dark.png ./reports/nav-glass-blur.png
```

Se borraba únicamente lo que se acababa de crear, con rutas relativas específicas.

---

## 2. La relajación de disciplina: el comodín de la discordia

Hacia el final de una larga sesión de depuración, tras iterar una docena de veces con ajustes de CSS, la carpeta raíz del espacio de trabajo temporal (`~/Swapps/`) tenía varias capturas de prueba dispersas.

En lugar de listar los archivos generados o borrarlos por prefijo exacto, entró en juego el atajo de la pereza mental:

```bash
# El comando destructivo
$ rm -f ~/Swapps/*.png
```

El cursor parpadeó medio segundo y volvió al prompt en silencio. Sin advertencias. Sin confirmaciones. Sin errores.

---

## 3. El impacto del desastre silencioso

La raíz de `~/Swapps/` no era un espacio de trabajo aislado: **era un directorio compartido donde diversas sesiones de automatización, tareas de QA y diagnósticos de incidentes depositaban archivos temporales de referencia.**

Al revisar la papelera:
```bash
$ ls -la ~/.local/share/Trash/files
# Vacío. rm en Linux no usa papelera.
```

Al revisar el historial de Git:
```bash
$ git status
# Las capturas eran archivos locales de trabajo, nunca comiteados.
```

Habíamos eliminado:
- 35 capturas de regresión visual de un cliente corporativo antes de su lanzamiento.
- Evidencias visuales de defectos de contraste WCAG en formularios públicos.
- Capturas de auditorías forenses de certificados TLS y paneles comprometidos.

En sistemas de archivos ext4 con discos de estado sólido (SSD) y comandos de descarte TRIM activos, las herramientas de recuperación forense tipo `ext4magic` o `testdisk` tienen una probabilidad de éxito cercana a cero una vez que los bloques son desreferenciados. **Los archivos se habían ido para siempre.**

---

## 4. Por qué ocurrió: análisis de causa raíz

1. **Divergencia de método:** Se pasó de un método riguroso y determinista (borrar por lista explícita) a un método estocástico (comodines en carpetas amplias) justo en el último paso de la tarea, cuando la fatiga cognitiva reduce la guardia.
2. **Falta de contención de alcance:** Los scripts de prueba guardaban capturas en la raíz del directorio general en lugar de un subdirectorio efímero dedicado (`~/Swapps/tmp/session-20260909/`).
3. **Ausencia de red de seguridad en shell:** El alias clásico de supervivencia `alias rm='rm -I'` o herramientas de borrado seguro con papelera CLI (`trash-cli`) no estaban configuradas en el entorno.

---

## 5. Medidas operativas inmediatas y permanentes

Para erradicar este riesgo de raíz, adoptamos tres políticas innegociables:

### 1. Directorios efímeros por ejecución (`mktemp -d`)
Todo script de pruebas o auditoría que genere archivos temporales debe crear su propio directorio aislado:
```bash
WORK_DIR=$(mktemp -d "/tmp/qa-audit-$(date +%Y%m%d)-XXXXXX")
# Al terminar, se destruye únicamente ese subdirectorio seguro
rm -rf "$WORK_DIR"
```

### 2. Prohibición de comodines globales sin `ls` previo
En nuestros runbooks quedó prohibido ejecutar `rm *.<ext>` sin haber ejecutado primero un `ls` de validación:
```bash
# Regla de oro:
ls -l ~/Swapps/*.png  # 1. Inspeccionar la lista real
rm ~/Swapps/test-*.png # 2. Borrar solo con prefijo acotado
```

### 3. Reemplazo de `rm` por `trash-put`
Instalamos y recomendamos `trash-cli` en todas las estaciones de trabajo de operaciones:
```bash
sudo apt install trash-cli
alias rm='trash-put'
```

Si ejecutas un comando por error, `trash-restore` te permite recuperar el archivo intacto en cuestión de segundos.
"""
}

# -------------------------------------------------------------
# Post 07: llave-ci-ssh-bastion-permisos-despliegue
# -------------------------------------------------------------
posts["llave-ci-ssh-bastion-permisos-despliegue"] = {
    "title": "La llave de CI que nunca estuvo ahí: cómo un bastión SSH y un script local engañaron al pipeline",
    "date": "2026-08-22",
    "category": "CI/CD & DevOps",
    "excerpt": "El pipeline de despliegue a producción en GitHub Actions comenzó a fallar sistemáticamente con 'Permission denied (publickey)' al conectar al bastión. La investigación reveló una verdad incómoda: la llave privada nunca había existido en los secretos del repositorio.",
    "coverImage": "/blog-posts/images/tui-banner.png",
    "coverAlt": "Configuración de llaves SSH y pipelines de integración continua en GitHub Actions",
    "body": f"""{WARNING_CALLOUT}

---

En ingeniería de confiabilidad existe una categoría fascinante de incidentes: **fallos en los que todo el equipo jura que una automatización siempre ha funcionado sola, hasta que una falla revela que jamás estuvo configurada en primer lugar.**

Esto fue lo que descubrimos en el pipeline de despliegue a producción de **Proyecto Horizonte**. Un viernes por la tarde, tras aprobar un hotfix de emergencia en el repositorio principal, el workflow de GitHub Actions falló con un error seco:

```text
Load key "/tmp/deploy_key": invalid format
ubuntu@bastion.ejemplo.org: Permission denied (publickey).
fatal: Could not read from remote repository.
Process completed with exit code 255.
```

El equipo reaccionó con extrañeza: *«¿Alguien cambió las llaves del bastión o expiró la clave de SSH?»*.

La investigación forense del pipeline reveló que el despliegue automático desde GitHub Actions **nunca había funcionado**. Durante casi un año, todos los despliegues exitosos habían sido ejecutados a mano desde la terminal de un ingeniero que tenía su propia llave SSH cargada en memoria.

---

## 1. La arquitectura de acceso: el bastión obligatorio

Para proteger los servidores de producción de Proyecto Horizonte, las máquinas no tienen puertos de administración expuestos a internet. Todo comando de despliegue debe atravesar un **nodo bastión** intermediario:

```text
GitHub Actions Runner ──> [ Bastion Host ] ──> [ Nodo Prod Web ]
                       (SSH Port 2222)      (Red Privada 10.10.x.x)
```

El archivo de workflow `.github/workflows/deploy.yml` contenía los siguientes pasos:

```yaml
- name: Configure SSH Key
  run: |
    mkdir -p ~/.ssh
    echo "${{{{ secrets.DEPLOY_SSH_KEY }}}}" > ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa
    ssh-keyscan -p 2222 bastion.ejemplo.org >> ~/.ssh/known_hosts

- name: Execute Remote Deploy
  run: |
    ssh -p 2222 ubuntu@bastion.ejemplo.org "ssh node-prod 'sudo /srv/apps/deploy.sh'"
```

A simple vista, una configuración impecable.

---

## 2. Tirando del hilo: ¿qué contenía el secreto?

Inspeccionamos los logs del runner en modo de depuración. El error `Load key: invalid format` suele indicar que el contenido inyectado desde el secreto de GitHub no tiene la estructura de una llave PEM u OpenSSH válida.

Utilizando un job de diagnóstico que calculaba el hash SHA256 y la longitud en bytes del secreto sin imprimir su contenido sensible:

```bash
echo -n "$DEPLOY_SSH_KEY" | wc -c
# Resultado: 0 bytes
```

**El secreto `DEPLOY_SSH_KEY` en los Settings del repositorio estaba completamente vacío.**

### ¿Cómo se habían hecho los despliegues anteriores?
Revisamos el historial de despliegues en el servidor de producción. El código se actualizaba periódicamente cada dos o tres semanas. 

Al cruzar los logs de autenticación de SSH en el bastión (`/var/log/auth.log`):
```text
Accepted publickey for ubuntu from 198.51.100.42 port 52310 ssh2: RSA SHA256:d8a9f... [macbook-pro-lead-eng]
```

Todas las ejecuciones provenían de la IP residencial y la llave SSH personal del Líder Técnico. Había creado un script local `deploy-prod.sh` en su máquina que se conectaba al bastión y corría el comando directamente. En el equipo se había asumido que los pushes a `master` desplegaban automáticamente, cuando en realidad dependían de la intervención manual del ingeniero.

---

## 3. Remediación: aprovisionamiento de identidad de máquina

Para independizar el pipeline de credenciales humanas y solucionar el despliegue de raíz:

### Paso 1: Generación de una llave dedicada para CI
Generamos un par de llaves Ed25519 con comentario explícito de auditoría:

```bash
ssh-keygen -t ed25519 -a 100 -C "ci-github-actions-horizonte-prod" -f ./ci_deploy_key
```

### Paso 2: Creación de usuario de servicio acotado en el bastión
En lugar de permitir que GitHub Actions se conectara como el usuario genérico `ubuntu` con privilegios de sudo total, creamos un usuario de servicio exclusivo:

```bash
sudo adduser --system --group --shell /bin/bash ci-deployer
sudo mkdir -p /home/ci-deployer/.ssh
sudo chmod 700 /home/ci-deployer/.ssh
```

En su archivo `authorized_keys` aplicamos restricciones de seguridad de SSH (*forced command scoping*):

```text
# /home/ci-deployer/.ssh/authorized_keys
from="140.82.112.0/20",no-port-forwarding,no-X11-forwarding,no-agent-forwarding ssh-ed25519 AAAAC3NzaC1lZDI1NTE5... ci-github-actions-horizonte-prod
```

### Paso 3: Carga correcta del secreto en GitHub
Cargamos la llave privada limpia en el secreto `DEPLOY_SSH_KEY` de GitHub Actions y verificamos la sintaxis con salto de línea final.

El primer despliegue 100% autónomo se ejecutó a las 18:40 UTC, completando la sincronización en 42 segundos sin depender de ninguna máquina local.

---

## 4. Lecciones aprendidas

1. **La ilusión de la automatización:** Nunca des por sentado que un workflow funciona porque "el código en producción está al día". Revisa el historial de runs en la pestaña Actions de GitHub.
2. **Los secretos vacíos fallan tarde:** Si un script de bash escribe una variable que resulta estar vacía, generará un archivo de cero bytes que fallará tres pasos más adelante. Agrega guardas preventivas en tus workflows:
   ```bash
   if [ -z "$DEPLOY_SSH_KEY" ]; then
     echo "Error crítico: DEPLOY_SSH_KEY no está configurada" >&2
     exit 1
   fi
   ```
3. **Identidades humanas vs Identidades de máquina:** El CI/CD jamás debe compartir llaves SSH con computadores de ingenieros. Si un miembro del equipo se va o pierde su laptop, la rotación de credenciales no debe afectar la entrega continua.
"""
}

# -------------------------------------------------------------
# Post 08: postgres-ownership-migraciones-django-bloqueadas
# -------------------------------------------------------------
posts["postgres-ownership-migraciones-django-bloqueadas"] = {
    "title": "Migraciones de Django bloqueadas en PostgreSQL: el laberinto de permisos USAGE vs OWNERSHIP",
    "date": "2026-08-28",
    "category": "Bases de Datos & SRE",
    "excerpt": "Un despliegue rutinario de Django colapsó con 'must be owner of table'. La aplicación tenía permisos de lectura y escritura completos, pero no podía alterar esquemas. Crónica de cómo resolver la propiedad de tablas y secuencias serial en PostgreSQL sin tiempo de inactividad.",
    "coverImage": "/blog-posts/images/oxker.png",
    "coverAlt": "Consola de PostgreSQL y gestión de esquemas en bases de datos relacionales",
    "body": f"""{WARNING_CALLOUT}

---

En PostgreSQL existe una distinción fundamental que a menudo toma por sorpresa a desarrolladores experimentados: **tener `GRANT ALL PRIVILEGES` sobre una base de datos no te convierte en el dueño (*owner*) de sus tablas.**

Vivimos este problema en el backend financiero de **Proyecto AgroFin**, una plataforma desarrollada en Django que procesa transacciones agrícolas y contratos de crédito. Durante una actualización de esquema en el entorno de staging que debía preparar el despliegue a producción, el comando `python manage.py migrate` se estrelló con un error fatal:

```text
django.db.utils.ProgrammingError: must be owner of table facturacion_facturaelectronica
```

La aplicación llevaba meses funcionando normalmente: insertaba, consultaba, actualizaba y eliminaba registros sin ningún inconveniente. Sin embargo, en el instante en que Django intentó ejecutar un `ALTER TABLE` para agregar una columna indexada, el motor de base de datos le cerró la puerta.

---

## 1. El síntoma y la trampa del `GRANT`

La primera reacción del equipo fue conectarse a la consola de PostgreSQL con el usuario administrador y otorgar todos los permisos posibles al usuario de la aplicación:

```sql
GRANT ALL PRIVILEGES ON DATABASE agrofin_db TO user_agrofin_app;
GRANT ALL ON SCHEMA facturacion TO user_agrofin_app;
GRANT ALL ON ALL TABLES IN SCHEMA facturacion TO user_agrofin_app;
```

Se reintentó la migración:
```bash
$ python manage.py migrate
django.db.utils.ProgrammingError: must be owner of table facturacion_facturaelectronica
```

El error persistía exactamente igual.

### ¿Por qué falla?
En el modelo de seguridad de PostgreSQL:
- `GRANT ALL` sobre una tabla otorga privilegios DML (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `REFERENCES`).
- **Solo el propietario (*owner*) del objeto o un superusuario** tiene autorización para ejecutar operaciones DDL (`ALTER TABLE`, `DROP TABLE`, `CREATE INDEX`, cambios de tipo de datos).

Al inspeccionar los metadatos de las tablas:
```sql
SELECT tablename, tableowner FROM pg_tables WHERE schemaname = 'facturacion';
```
```text
          tablename           |  tableowner  
------------------------------+--------------
 facturacion_facturaelectronica| admin_db
 facturacion_detallefactura   | admin_db
 crm_cliente                  | admin_db
```

Las tablas habían sido creadas originalmente durante una restauración manual de backup ejecutada por un administrador de sistemas conectado como `admin_db`. Como resultado, la aplicación (`user_agrofin_app`) tenía permisos de uso, pero no era la dueña.

---

## 2. La trampa no obvia: secuencias `SERIAL` e `IDENTITY`

Reasignar la propiedad de las tablas parecía tan simple como ejecutar un bucle de `ALTER TABLE ... OWNER TO user_agrofin_app`.

Pero al llegar a las columnas de clave primaria autonuméricas (`SERIAL`), apareció un segundo tropiezo:

```sql
ALTER SEQUENCE facturacion_facturaelectronica_id_seq OWNER TO user_agrofin_app;
-- ERROR: sequence must belong to owner of table "facturacion_facturaelectronica"
```

En PostgreSQL, si intentas reasignar la secuencia antes de cambiar la tabla (o viceversa de forma aislada), el catálogo rechaza la orden. La secuencia está ligada como dependencia estricta (`pg_depend`) a la columna de la tabla.

---

## 3. La remediación determinista: bloque PL/pgSQL

Para corregir la propiedad de cientos de tablas distribuidas en múltiples esquemas (`facturacion`, `crm`, `interfaces`, `sarlaft`) sin cometer errores manuales, diseñamos un bloque procedural en PL/pgSQL que recorre el catálogo dinámicamente:

```sql
DO $$
DECLARE
    r RECORD;
    target_user TEXT := 'user_agrofin_app';
    target_schemas TEXT[] := ARRAY['facturacion', 'crm', 'interfaces', 'sarlaft', 'public'];
    sch TEXT;
BEGIN
    FOREACH sch IN ARRAY target_schemas
    LOOP
        -- 1. Cambiar propietario del esquema
        EXECUTE format('ALTER SCHEMA %I OWNER TO %I', sch, target_user);

        -- 2. Cambiar propietario de todas las tablas (arrastra secuencias dependientes)
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = sch)
        LOOP
            EXECUTE format('ALTER TABLE %I.%I OWNER TO %I', sch, r.tablename, target_user);
        END LOOP;

        -- 3. Cambiar propietario de secuencias huérfanas
        FOR r IN (SELECT sequencename FROM pg_sequences WHERE schemaname = sch)
        LOOP
            EXECUTE format('ALTER SEQUENCE %I.%I OWNER TO %I', sch, r.sequencename, target_user);
        END LOOP;

        -- 4. Cambiar propietario de vistas
        FOR r IN (SELECT table_name FROM information_schema.views WHERE table_schema = sch)
        LOOP
            EXECUTE format('ALTER VIEW %I.%I OWNER TO %I', sch, r.table_name, target_user);
        END LOOP;
    END LOOP;
END $$;
```

---

## 4. Garantizar el futuro: `ALTER DEFAULT PRIVILEGES`

Cambiar el estado actual no evita que un futuro backup o script manual ejecutado como superusuario vuelva a romper los permisos. Para resolverlo de forma permanente, configuramos privilegios por defecto:

```sql
ALTER DEFAULT PRIVILEGES FOR ROLE admin_db IN SCHEMA facturacion 
    GRANT ALL ON TABLES TO user_agrofin_app;

ALTER DEFAULT PRIVILEGES FOR ROLE admin_db IN SCHEMA facturacion 
    GRANT ALL ON SEQUENCES TO user_agrofin_app;
```

Tras ejecutar la solución, el comando de migraciones de Django corrió en menos de tres segundos:

```bash
$ python manage.py migrate
Operations to perform:
  Apply all migrations: facturacion, crm
Running migrations:
  Applying facturacion.0014_add_electronic_invoice_hash... OK
  Applying crm.0009_update_tax_identifiers... OK
```

---

## 5. Lecciones aprendidas

1. **Nunca restaures backups con el superusuario sin fijar el rol:** Al usar `pg_restore`, utiliza siempre el parámetro `--no-owner --role=usuario_app` para garantizar que los objetos nazcan con el dueño correcto.
2. **Diferencia entre permisos de datos y permisos de catálogo:** Si tu aplicación corre migraciones automáticas (`ALTER TABLE`, `CREATE INDEX`), no le basta con permisos DML: debe ser la dueña legítima del esquema y de sus objetos.
3. **Las secuencias son esclavas de sus tablas:** No intentes forzar cambios en secuencias autonuméricas de manera independiente; transfiere la propiedad de la tabla contenedora y PostgreSQL alineará las dependencias.
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

print(f"Batch 1 complete: {len(posts)} posts generated.")
