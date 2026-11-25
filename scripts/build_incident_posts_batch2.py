#!/usr/bin/env python3
"""
Generator script for real-world SRE & security incident blog posts (Batch 2).
"""

import os

POSTS_DIR = "/home/zero/Workspace/personal/zer0-sh.github.io/public/blog-posts"
os.makedirs(POSTS_DIR, exist_ok=True)

WARNING_CALLOUT = """> [!WARNING] **Nota de confidencialidad y contexto:**  
> *Los nombres de organizaciones, proyectos, identificadores de red y credenciales han sido anonimizados por motivos de seguridad y confidencialidad operativa. La arquitectura técnica, la cronología de eventos, los comandos ejecutados, los diagnósticos y las lecciones aprendidas corresponden a un incidente real vivido en producción.*
"""

posts = {}

# -------------------------------------------------------------
# Post 09: recaptcha-split-configuracion-falsa-aprobacion
# -------------------------------------------------------------
posts["recaptcha-split-configuracion-falsa-aprobacion"] = {
    "title": "El reporte que decía 'funciona': reCAPTCHA, configuraciones divididas y la trampa del caché en QA",
    "date": "2026-09-30",
    "category": "Frontend & Arquitectura",
    "excerpt": "Una tarea simple para evitar exponer secretos de reCAPTCHA en entornos de prueba desencadenó un mes de problemas en cadena: iframes rotos, scripts que cancelaban envíos y un reporte de QA que dio el fix por bueno cuando el entorno seguía mostrando contenido cacheado.",
    "coverImage": "/blog-posts/images/opencode.png",
    "coverAlt": "Formularios web, validación de captcha y arquitectura de configuración por entorno",
    "body": f"""{WARNING_CALLOUT}

---

En desarrollo web hay una frase clásica de cierre de sprint que infunde falso alivio:  
*«Ya pasó QA en staging, podemos pasar a producción»*.

Este incidente ocurrido en el portal institucional de **Proyecto Arquia** (un sitio Drupal en arquitectura PaaS) nos enseñó por qué esa frase puede ser un espejismo cuando intervienen tres factores concurrentes: **módulos de división de configuración (*config split*), scripts de tema con validaciones agresivas y capas de caché agresivas que enmascaran el estado real del código.**

Lo que empezó como una tarea preventiva de cinco minutos para no utilizar la clave de API real de Google reCAPTCHA en los entornos de desarrollo terminó convirtiéndose en un laberinto de un mes.

---

## 1. El objetivo inicial: aislar las llaves de producción

En Drupal, es una mala práctica que los entornos de `dev` y `test` envíen eventos a la cuenta de reCAPTCHA de producción. La tarea solicitaba:
1. Usar las credenciales reales de reCAPTCHA únicamente en el entorno `live`.
2. En entornos fuera de producción, recurrir a un captcha matemático nativo o dejar el formulario libre para pruebas automatizadas.

El desarrollador asignado implementó el cambio en `settings.php` mediante el Pull Request `#2782`:

```php
// settings.php
if (defined('PANTHEON_ENVIRONMENT') && PANTHEON_ENVIRONMENT === 'live') {{
    $config['recaptcha.settings']['secret_key'] = $secrets['recaptcha_secret_key'];
}} else {{
    // Fuera de live no se define la llave secreta
    $config['recaptcha.settings']['secret_key'] = '';
}}
```

En la máquina local del desarrollador funcionó. Se desplegó a `test` y el equipo de QA reportó: *«Verificado, el formulario funciona»*.

---

## 2. El primer tropiezo: el iframe roto y la clave pública

Días después, un usuario de pruebas reportó un error visual estridente en el entorno de staging:

```text
ERROR for site owner: Invalid domain for site key
```

El iframe de Google reCAPTCHA se renderizaba en rojo en medio del formulario.

### La causa
El PR anterior solo había vaciado `secret_key` (la clave privada en el servidor), pero **había dejado intacta `site_key` (la clave pública que se envía al navegador)** en la base de datos de configuración sincronizada (`config/sync/recaptcha.settings.yml`).

Como Google reCAPTCHA v3 valida el dominio del cliente contra la lista autorizada en la consola de Google, al ejecutarse desde un dominio `test-arquia.ejemplo.org` no registrado, el widget de Google arrojaba un error perimetral que bloqueaba la interfaz.

---

## 3. La segunda sorpresa: el split que no era un split

Para solucionar el problema, el equipo intentó utilizar la herramienta nativa de Drupal para separar configuraciones por entorno: **Config Split** (`config_split.live_split`). La idea era que `site_key` solo se importara en producción.

Al revisar la configuración descubrimos una sorpresa:

```php
// settings.php línea 64
if (defined('PANTHEON_ENVIRONMENT')) {{
    $config['config_split.config_split.live_split']['status'] = TRUE;
}}
```

El condicional evaluaba si existía la constante `PANTHEON_ENVIRONMENT`, ¡la cual existe en **todos** los entornos (`dev`, `test`, `live` y multidevs)! 

Por lo tanto, **el supuesto 'split exclusivo de live' se estaba aplicando a toda la flota.** Si vaciábamos `site_key` en esa configuración, rompíamos el formulario en producción real.

---

## 4. El bloqueo en JavaScript del tema

Tras corregir la lógica del split para aislar de verdad a `live`, surgió un síntoma aún más desconcertante: en el entorno `test`, al hacer clic en *Enviar*, el formulario simplemente no hacía nada.

Al abrir la consola de desarrollo del navegador:

```javascript
// webform-recaptcha-consent.js (línea 42)
if (!grecaptcha.getResponse()) {{
    alert("Por favor complete la verificación de seguridad antes de continuar.");
    event.preventDefault();
    return false;
}}
```

El tema institucional contenía un script propio de JavaScript que interceptaba el evento `submit` y cancelaba la petición si el objeto `grecaptcha` no devolvía un token válido. Como habíamos retirado el widget en `test`, el script de frontend entraba en un bucle ciego y hacía imposible enviar el formulario.

---

## 5. El falso positivo del reporte de QA: la trampa del caché

¿Cómo fue posible que el reporte inicial dijera que todo funcionaba?

Hicimos una inspección de los encabezados HTTP que devolvía la plataforma durante la prueba de QA:

```http
HTTP/2 200 OK
X-Cache: HIT
X-Cache-Hits: 14
Age: 86420
```

El entorno `test` tenía una capa de caché de Varnish con TTL de varios días. Cuando el revisor de QA abrió la página para probar, **estaba interactuando con una versión estática compilada 24 horas antes del despliegue del PR**. El formulario que probó era el formulario antiguo. Dio el visto bueno sobre un fantasma en memoria.

---

## 6. Remediación integral

Para resolver los cuatro problemas de forma armónica:

1. **Frontend:** Se modificó `webform-recaptcha-consent.js` para realizar una salida temprana limpia:
   ```javascript
   if (typeof grecaptcha === 'undefined' || !drupalSettings.recaptcha) {{
       // Si el entorno no tiene reCAPTCHA activo, permitir el envío normal
       return true;
   }}
   ```
2. **Backend:** Se condicionó estrictamente la carga de llaves y del split:
   ```php
   $is_production = (defined('PANTHEON_ENVIRONMENT') && PANTHEON_ENVIRONMENT === 'live');
   $config['config_split.config_split.live_split']['status'] = $is_production;
   ```
3. **Pipeline de despliegue:** Se agregó una directiva de purga atómica de caché (`terminus env:clear-cache`) en cada paso de CI/CD para que ningún revisor vuelva a evaluar páginas zombis.

---

## 7. Lecciones aprendidas

1. **Desconfía de las pruebas en páginas con caché:** Antes de iniciar cualquier sesión de QA o validación post-despliegue, verifica en los headers HTTP que `Age: 0` o haz un bypass forzado con parámetros de consulta (`?nocache=1`).
2. **Las llaves públicas también tienen lógica:** Proteger un secreto no es solo esconder la `secret_key`. Si la `site_key` pública depende de una validación de dominio de terceros, también debe aislarse por entorno.
3. **El frontend debe tolerar la ausencia de servicios auxiliares:** Si un servicio de analítica o captcha no carga o está deshabilitado, tus formularios nunca deben colapsar por una excepción no controlada en JavaScript.
"""
}

# -------------------------------------------------------------
# Post 10: multidevs-pantheon-condicion-carrera-despliegues
# -------------------------------------------------------------
posts["multidevs-pantheon-condicion-carrera-despliegues"] = {
    "title": "Los entornos de prueba que parecían vivos: condiciones de carrera en despliegues efímeros por PR",
    "date": "2026-10-20",
    "category": "CI/CD & Plataforma",
    "excerpt": "Los entornos efímeros multidev creados por GitHub Actions a veces aparecían listados pero no tenían base de datos o devolvían '404 Unknown Site'. Tras cuatro semanas de fallos intermitentes encontramos al culpable: una condición de carrera asíncrona entre dos pushes sucesivos.",
    "coverImage": "/blog-posts/images/tui-banner.png",
    "coverAlt": "Automatización de entornos efímeros multidev y condiciones de carrera en CI/CD",
    "body": f"""{WARNING_CALLOUT}

---

Los entornos efímeros bajo demanda (crear un entorno completo con base de datos y URL propia por cada Pull Request) son el santo grial del desarrollo moderno. Sin embargo, cuando se combinan **APIs asíncronas de infraestructura cloud, timeouts en pipelines de CI y desarrolladores empujando commits con rapidez**, el resultado puede ser desconcertante.

Durante octubre enfrentamos un problema esquivo en varios de nuestros proyectos: de forma aparentemente aleatoria, los entornos de prueba recién creados por GitHub Actions fallaban de formas extrañas:
- En ocasiones, la URL devolvía un frío `404 - Unknown site`.
- Otras veces, la URL cargaba pero redirigía a `/wp-admin/install.php` (WordPress indicando que la base de datos no existía).
- Y en la consola de la plataforma, el entorno figuraba como *Healthy* en la lista de entornos activos.

Tardamos casi un mes y cuatro incidentes en aislar la causa raíz: una sutil **condición de carrera entre dos ejecuciones concurrentes del mismo pipeline**.

---

## 1. La anatomía del workflow de creación

El flujo en GitHub Actions (`setup_environment.yaml`) constaba de tres pasos secuenciales:

```yaml
- name: Create Multidev Environment
  run: terminus multidev:create $SITE.live $BRANCH_NAME

- name: Clone Content from Live
  run: terminus env:clone-content $SITE.live $BRANCH_NAME --files-only=false

- name: Deploy Code Branch
  run: git push pantheon $BRANCH_NAME
```

En condiciones normales de laboratorio, todo funcionaba en unos 4 minutos. Pero en el mundo real, los desarrolladores corrigen un error de linter, hacen un segundo `git commit` y vuelven a hacer `git push` apenas 60 segundos después del primero.

---

## 2. El caso testigo: el timeout engañoso

El 25 de septiembre analizamos el caso del repositorio `portal-dental-forum`:

1. El primer push disparó el workflow Run #412.
2. El comando `terminus multidev:create` envió la petición a la API de la plataforma. La plataforma inició la clonación de contenedores en segundo plano.
3. El comando CLI en el runner de GitHub Actions tiene un timeout de espera de 180 segundos. Como la plataforma estaba bajo alta carga, el CLI arrojó timeout y terminó con código de salida `1`.
4. El pipeline se canceló de inmediato. Los pasos de clonación de base de datos (`clone-content`) nunca se ejecutaron.
5. **Pero en la plataforma cloud, la tarea asíncrona continuó corriendo y completó la creación del contenedor.**

El entorno quedó en un estado "medio nacido":
- Existía el contenedor web.
- Respondía en la lista de `terminus env:list`.
- **Pero no tenía base de datos.** Cualquier visitante que abría la URL caía en la pantalla de instalación limpia de WordPress.

---

## 3. La trampa mortal: el segundo push en paralelo

Para empeorar las cosas, el segundo push del desarrollador (Run #413) se activó mientras el primer entorno incompleto se creaba:

```text
Commit A ───> [multidev:create] ──> (Timeout en CI, pero el cloud sigue creando)
                   │
Commit B ───> Verifica si existe ──> "Ya existe" ──> Hace git push de código
              (Salta creación de BD) ──> Entorno roto permanentemente
```

El Run #413 consultó la API con `terminus multidev:list`. Como la plataforma ya había registrado el nombre del entorno, el script concluyó erróneamente: *«El entorno ya existe, no hace falta crearlo ni clonar base de datos; solo despleguemos el nuevo código»*.

El código se desplegó sobre un contenedor sin base de datos, dejando el PR completamente bloqueado para el equipo de QA.

---

## 4. La solución: Mutex, Concurrency y Verificación de Estado

Para hacer el pipeline 100% resiliente y a prueba de carreras, implementamos tres niveles de protección:

### 1. Cancelación de ejecuciones concurrentes en GitHub Actions
Utilizamos el bloque `concurrency` nativo para garantizar que un nuevo push cancele atómicamente cualquier corrida previa sobre la misma rama:

```yaml
concurrency:
  group: multidev-${{{{ github.head_ref || github.ref }}}}
  cancel-in-progress: true
```

### 2. Verificación de salud real (no solo existencia)
Modificamos el script de comprobación para no confiar únicamente en `env:list`. Ahora el script ejecuta una verificación funcional de base de datos antes de decidir si el entorno es viable:

```bash
# Validar si el sitio está realmente instalado
IS_INSTALLED=$(terminus wp $SITE.$BRANCH_NAME -- core is-installed 2>&1 || true)

if [[ "$IS_INSTALLED" != *"The site is installed"* ]]; then
    echo "[!] El entorno existe pero no tiene base de datos sana. Re-clonando contenido..."
    terminus env:clone-content $SITE.live $BRANCH_NAME --yes
fi
```

### 3. Aumento del timeout del cliente CLI
Ajustamos las variables de entorno de Terminus para tolerar picos de congestión en la API del proveedor:

```bash
export TERMINUS_TIMEOUT=600
```

---

## 5. Lecciones aprendidas

1. **Las APIs asíncronas requieren idempotencia:** Si un comando de CLI termina por timeout, nunca asumas que la operación falló en la infraestructura remota. Diseña tus scripts para consultar el estado real del recurso.
2. **Usa `concurrency` en todos tus pipelines de PR:** Permitir que dos workflows compitan por aprovisionar o actualizar el mismo entorno efímero garantiza condiciones de carrera difíciles de diagnosticar.
3. **Existencia no equivale a operatividad:** Que un contenedor o máquina virtual responda en una lista de inventario no significa que sus dependencias (base de datos, almacenamiento de archivos, certificados) estén listas para recibir tráfico.
"""
}

# -------------------------------------------------------------
# Post 11: dors-plataforma-despliegues-zombi-redis
# -------------------------------------------------------------
posts["dors-plataforma-despliegues-zombi-redis"] = {
    "title": "La aplicación zombi que llevaba semanas caída: 32.000 tareas en Redis y la trampa del bastión compartido",
    "date": "2026-11-05",
    "category": "Arquitectura & Decomisión",
    "excerpt": "Cuando fuimos a dar de baja una vieja plataforma interna de despliegues descubrimos que llevaba semanas muerta: respondía HTTP 200 a los webhooks pero no procesaba nada. 32.000 tareas se acumulaban en Redis y su nombre de dominio compartía la IP del bastión crítico de la organización.",
    "coverImage": "/blog-posts/images/btop.png",
    "coverAlt": "Monitoreo de procesos en Linux, cola de tareas en Redis y servidores zombi",
    "body": f"""{WARNING_CALLOUT}

---

En infraestructuras que crecen a lo largo de varios años es común encontrar aplicaciones legadas que nadie se atreve a tocar: *«No le muevas nada, que por ahí pasan los webhooks de despliegue»*.

Esto fue lo que encontramos con **Sistema Nexus-Deploy** (conocido internamente como `dors`), una aplicación Django que en 2021 recibía webhooks de GitHub, creaba releases automatizados e integraba ramas de código. En el último trimestre de 2026 se acordó finalmente decomisionarla tras migrar la mayoría de los pipelines a GitHub Actions modernos.

Al iniciar el procedimiento de apagado seguro, la realidad nos sorprendió: **la aplicación ya estaba muerta. Llevaba semanas sin ejecutar una sola acción real, acumulaba 32.000 tareas encoladas en memoria y su dominio público compartía la misma dirección IP del bastión de red del cual dependía el acceso a todos los servidores de producción.**

---

## 1. La primera pista falsa: "Esta app corre en Gunicorn"

El primer paso para apagar o migrar un servicio es entender cómo corre. Al inspeccionar el repositorio de código fuente:
- El archivo `Procfile` declaraba: `web: gunicorn nexus.wsgi:application`
- El archivo `supervisord.conf` declaraba: `command=daphne -b 0.0.0.0 -p 8000 nexus.asgi:application`

Sin embargo, al consultar las trazas de errores recientes en Sentry:
```json
{{
  "server_name": "deploycloud-node-01",
  "sys.argv": ["uwsgi", "--ini", "/etc/uwsgi/apps-enabled/nexus.ini"],
  "runtime": "Python 3.9.23"
}}
```

**La aplicación no corría ni con Gunicorn ni con Daphne.** Corría con un proceso `uwsgi` configurado exclusivamente en el sistema de archivos del servidor, sin versionar en ningún repositorio Git.

> **Regla de oro de operaciones:** Para saber con certeza cómo corre un servicio en producción, inspecciona el servidor en vivo (`ps aux`) o una traza real de Sentry; nunca confíes ciegamente en los archivos de texto del repositorio.

---

## 2. El descubrimiento del zombi: 32.000 tareas en el limbo

Al ingresar al servidor y auditar la instancia local de Redis:

```bash
$ redis-cli -s /var/run/redis/redis.sock info keyspace
# db0:keys=32841,expires=0,avg_ttl=0

$ redis-cli -s /var/run/redis/redis.sock llen queue:default
(integer) 32819
```

Había más de **32.000 mensajes de webhook encolados** en memoria.

Al revisar los procesos del sistema con `systemctl`:
```bash
$ systemctl status nexus-worker.service
● nexus-worker.service - Celery Task Queue Worker
     Loaded: loaded (/etc/systemd/system/nexus-worker.service; enabled)
     Active: failed (Result: exit-code) since Mon 2026-09-14 03:12:18 UTC
   Main PID: 18420 (code=exited, status=1/FAILURE)
```

El worker de Celery había colapsado por una incompatibilidad de librerías hacía casi dos meses y nunca se reinició porque no tenía configurada la directiva `Restart=always`.

### ¿Por qué nadie se quejó?
El servidor web NGINX y el proceso uWSGI seguían arriba y recibían las peticiones HTTP `POST` de los webhooks de GitHub. La vista de Django simplemente ejecutaba `process_webhook.delay(payload)` y devolvía un alegre `HTTP 200 OK` con un cuerpo JSON: `{{"status": "queued"}}`.

GitHub veía códigos 200 en su historial de entregas. Los desarrolladores ya no usaban la app porque sus flujos habían migrado a GitHub Actions. La app consumía recursos, memoria y CPU recibiendo miles de eventos inútiles que nadie procesaba.

---

## 3. La trampa del dominio y el bastión de red

El plan inicial era simple: apagar la máquina virtual en el proveedor de cloud.

Pero antes de ejecutar `halt`, realizamos una auditoría de DNS y rutas de red:

```bash
$ dig +short app.deploycloud.ejemplo.org
198.51.100.85

$ dig +short bastion.ejemplo.org
198.51.100.85
```

**`app.deploycloud.ejemplo.org` era un registro DNS tipo A que apuntaba directamente a la IP pública del bastión SSH de la organización.** 

Esa misma máquina no era solo el host de la aplicación obsoleta: era el único túnel de entrada para conectarse a los servidores MySQL de producción, a las máquinas de campaña y a los clústeres internos. Si apagábamos el servidor o reasignábamos la IP sin cuidado, dejábamos incomunicado a todo el equipo de infraestructura.

---

## 4. El protocolo de decomisión quirúrgica

Para apagar el servicio sin afectar la red:

1. **Drenaje de tráfico web:** Modificamos la configuración de NGINX en el bastión para responder con `HTTP 410 Gone` a todas las rutas de la app, registrando los User-Agents para confirmar que ningún consumidor crítico siguiera llamándola.
2. **Limpieza de memoria:** Se purgó la base de datos de Redis (`FLUSHDB`) recuperando 450 MB de memoria RAM en el bastión.
3. **Parada y deshabilitación de servicios:**
   ```bash
   sudo systemctl stop uwsgi
   sudo systemctl disable uwsgi
   sudo rm /etc/systemd/system/nexus-worker.service
   sudo systemctl daemon-reload
   ```
4. **Retiro de Webhooks:** Se ejecutó un script en la API de GitHub para eliminar las suscripciones de webhook huérfanas en los 80 repositorios que seguían disparando eventos al servidor.

---

## 5. Lecciones aprendidas

1. **Un HTTP 200 no significa que el sistema esté funcionando:** Si tu endpoint devuelve un acuse de recibo pero delega el trabajo real a una cola asíncrona en segundo plano, tu monitoreo de salud debe verificar el rendimiento de los *workers*, no solo el código de respuesta HTTP.
2. **El principio de servicio único por máquina:** Alojar una aplicación web experimental y un bastión de seguridad crítico en la misma máquina virtual es un antipatrón grave. Cuando llega la hora de decomisionar la app, el riesgo colateral de tumbar la red operativa paraliza la limpieza.
3. **Documenta los decomisos con auditoría previa:** Antes de apagar cualquier servidor, realiza un análisis de DNS cruzado (`dig`), audita las reglas de firewall activas (`ufw status`) y verifica las conexiones abiertas (`ss -tulpn`).
"""
}

# -------------------------------------------------------------
# Post 12: dominio-huerfano-cuentas-claras-takeover
# -------------------------------------------------------------
posts["dominio-huerfano-cuentas-claras-takeover"] = {
    "title": "El dominio huérfano que terminó en una radio: servidores zombi, buckets borrados y el peligro de no decomisionar",
    "date": "2026-10-22",
    "category": "Seguridad & Decomisión",
    "excerpt": "Una aplicación Django de 2019 de datos abiertos seguía encendida en una máquina virtual de $5/mes, conectada a la base de datos de otro cliente. Su dominio había expirado y fue comprado por terceros, apuntando primero a un casino y luego a una radio online. La guía definitiva para apagar infraestructura olvidada.",
    "coverImage": "/blog-posts/images/cve-2026-9860.png",
    "coverAlt": "Auditoría de dominios expirados, servidores olvidados y fuga de datos en la nube",
    "body": f"""{WARNING_CALLOUT}

---

Existe una frase clásica de auditoría que siempre se cumple: **la infraestructura que nadie recuerda es la que más riesgo introduce.**

Durante un inventario consolidado de costos y máquinas virtuales en la nube, nos topamos con un servidor Linode de $5 dólares al mes que figuraba con el nombre `civica-prod-legacy`. Llevaba años facturando silenciosamente.

Al entrar a investigar qué corría en la máquina, descubrimos un escenario digno de un manual de ciberseguridad sobre negligencia en el ciclo de vida de proyectos:
- El servidor corría **Ubuntu 18.04** (sin soporte desde abril de 2023), con servicios de renovación de certificados TLS colapsados.
- Hospedaba una aplicación web de rendición de cuentas políticas construida en 2019 para una organización que llamaremos **Proyecto Cívica**.
- El dominio original (`civica-datos.co`) había expirado meses atrás y fue adquirido por especuladores de dominios: **apuntaba primero a un portal de apuestas y luego redirigía a una radio online.**
- El bucket de AWS S3 que almacenaba las declaraciones de renta y documentos patrimoniales de candidatos ya había sido eliminado.
- Y lo más alarmante: **el servidor seguía conectado por la red privada a la base de datos MySQL de producción de otro cliente totalmente distinto.**

---

## 1. El estado del servidor: un fósil en ejecución

Al conectarnos por SSH encontramos:
- Kernel sin parches desde 2021: `Linux 4.15.0-142-generic`.
- Servicios caídos: `certbot.service` en estado `failed` desde hacía dos años.
- Un proceso `uwsgi` corriendo un proyecto Django de 2019 basado en Python 3.6.

El archivo de configuración de entorno (`.env`) contenía:
- Credenciales de una base de datos PostgreSQL alojada en el servidor de **Proyecto Horizonte** (conexión cruzada entre clientes).
- Claves de acceso de AWS (`AKIA...`) y credenciales de envío masivo de correo de Mailgun.

Al intentar consultar el bucket de almacenamiento configurado:
```bash
$ aws s3 ls s3://civica-documentos-adjuntos/
An error occurred (NoSuchBucket) when calling the ListObjectsV2 operation: The specified bucket does not exist
```

Los adjuntos originales (declaraciones juramentadas, copias de cédulas, certificados de renta) ya se habían perdido o el bucket había sido eliminado en una limpieza anterior en la cuenta de AWS.

---

## 2. La pesadilla del dominio huérfano (*Domain Takeover*)

El síntoma más evidente de abandono fue el dominio web. 

Al consultar el registro DNS:
```bash
$ whois civica-datos.co | grep -E "Creation Date|Registrant"
Creation Date: 2026-09-02T14:18:22Z
Registrant Organization: Domain Privacy Protection Service
```

El dominio institucional había expirado a mediados de 2026. Nadie renovó la suscripción anual. Un bot de subastas de dominios expirados lo compró de inmediato para aprovechar su autoridad histórica de SEO institucional.

Al hacer una petición HTTP al dominio:
- El 20 de octubre: Devolvía contenido de un casino en línea con enlaces a casas de apuestas.
- El 21 de octubre: Devolvía un `HTTP 301 Moved Permanently` hacia una estación de streaming de audio en línea (`black.radio.fm`).

Cualquier ciudadano, periodista o entidad fiscalizadora que buscara los informes de transparencia de candidatos políticos era redirigido a una plataforma de streaming o apuestas comerciales.

---

## 3. La app que ni siquiera podía cargar

Para colmo de males, si intentabas consultar la IP pública del servidor directamente:

```bash
$ curl -I http://198.51.100.99/
# Pasados 39 segundos de silencio...
HTTP/1.1 502 Bad Gateway
```

Al revisar los logs de error de NGINX:
```text
upstream timed out (110: Connection timed out) while connecting to upstream, client: 198.51.100.42, upstream: "uwsgi://127.0.0.1:8000"
```

El servidor web ni siquiera podía arrancar la aplicación. La base de datos PostgreSQL remota a la que intentaba conectarse en el puerto 5432 estaba filtrada por reglas de firewall actualizadas semanas atrás. **El servidor consumía electricidad y generaba costos para arrojar un error 502 en un bucle eterno.**

---

## 4. El protocolo de decomisión segura en orden estricto

Dar de baja un servidor no es solo hacer clic en "Delete Instance". Si eliminas la máquina antes de limpiar sus dependencias, dejas cabos sueltos peligrosos. Seguimos este orden:

```text
1. Copia de Seguridad Forense (Dump Offline)
   └── Respaldar código local y archivos residuales fuera de Git

2. Revocación Inmediata de Credenciales
   └── Desactivar claves IAM de AWS en la consola cloud
   └── Revocar API Keys de Mailgun

3. Aislamiento de Red
   └── Borrar reglas de acceso en el firewall del servidor de base de datos
   └── Bloquear tráfico entrante en ufw

4. Eliminación de la Máquina Virtual
   └── Destruir el nodo en Linode para detener la facturación
```

---

## 5. Lecciones aprendidas

1. **La propiedad del dominio es un activo de seguridad crítico:** Perder el control de un dominio institucional expirado permite a atacantes suplantar la identidad de tu organización (*domain hijacking*), interceptar correos electrónicos dirigidos a cuentas viejas y destruir la reputación de marca.
2. **Monitorea los costos pequeños:** Una instancia de $5 o $10 dólares al mes no llama la atención en la contabilidad, pero suele ser el escondite perfecto de sistemas olvidados y vulnerables. Audita tus facturas mensualmente.
3. **El principio de segregación estricta de clientes:** Dos clientes distintos **nunca** deben compartir la misma instancia de base de datos ni depender de reglas de red cruzadas. Cuando un proyecto muere, debe poder apagarse sin que nadie tenga que preguntarse si otro cliente se verá afectado.
"""
}

# -------------------------------------------------------------
# Post 13: poc-ia-produccion-cuello-botella-concurrencia
# -------------------------------------------------------------
posts["poc-ia-produccion-cuello-botella-concurrencia"] = {
    "title": "El 'POC' de Inteligencia Artificial que salía a producción en tres días: pruebas de carga y el cuello de botella de Uvicorn",
    "date": "2026-09-23",
    "category": "Arquitectura & Rendimiento",
    "excerpt": "Se llamaba 'POC' en todas las ramas de Git y tickets, pero descubrimos que saldría a miles de usuarios reales en 72 horas. Una prueba de carga con 20 peticiones concurrentes arrojó 9 timeouts y colapsó la API en FastAPI. Crónica de cómo evitar un desastre de rendimiento a contrarreloj.",
    "coverImage": "/blog-posts/images/opencode.png",
    "coverAlt": "Pruebas de carga, concurrencia en FastAPI/Uvicorn y despliegues de modelos de IA",
    "body": f"""{WARNING_CALLOUT}

---

En el auge del desarrollo con modelos de lenguaje hay una trampa semántica muy extendida: **llamar 'POC' (*Proof of Concept*) a un producto final para justificar el avance rápido sin controles de carga, hasta que alguien anuncia en una reunión que el lanzamiento público es este jueves.**

Esto fue exactamente lo que ocurrió con el asistente conversacional de **Proyecto Arquia**. La arquitectura consistía en una interfaz de chat integrada en Drupal que se comunicaba mediante un proxy HTTP con una API en Python (FastAPI + LangChain) alojada en un clúster cloud.

Durante las semanas de desarrollo, todas las tareas, ramas de Git y conversaciones se referían al sistema como *"el POC de IA"*. Con esa etiqueta mental, las advertencias de arquitectura se trataban como temas menores para un hipotético futuro. 

El lunes 21 de septiembre, en una llamada de sincronización, el líder de producto soltó la bomba:  
*«El jueves a las 09:00 lanzamos el comunicado oficial a 25.000 usuarios agremiados»*.

Teníamos 72 horas para auditar la resistencia técnica de un prototipo antes de que el tráfico masivo lo destruyera.

---

## 1. La prueba de fuego: 20 peticiones concurrentes

Para evaluar la capacidad real del backend de IA, ejecutamos una prueba de carga sintética simulando un escenario mínimo de uso real: **20 usuarios concurrentes enviando una consulta sencilla simultáneamente.**

El resultado fue catastrófico:

```text
======================= RESULTADOS DE CARGA (20 USUARIOS) =======================
Peticiones exitosas: 11 / 20 (55%)
Peticiones fallidas (Timeout > 30s): 9 / 20 (45%)
Tiempo de respuesta promedio: 18.4 segundos
Latencia percentil 95 (P95): 31.2 segundos (HTTP 504 Gateway Timeout)
==================================================================================
```

Con solo 20 personas interactuando al mismo tiempo, **casi la mitad de las peticiones caía en timeout**. La interfaz web en Drupal se congelaba y mostraba un mensaje genérico de error de conexión.

---

## 2. La autopsia del cuello de botella: Uvicorn con un solo worker

Al auditar la configuración del contenedor de la API en el archivo Dockerfile:

```dockerfile
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Uvicorn arrancaba con su configuración predeterminada: **un único proceso worker de Python en un solo hilo de ejecución.**

Aunque FastAPI está diseñado sobre asyncio, las llamadas a los modelos de lenguaje (LLM) y a la base de datos vectorial ejecutaban operaciones síncronas bloqueantes en varias partes del código (tokenización local, serialización de esquemas Pydantic complejos y llamadas a librerías de embeddings sin `run_in_threadpool`).

El resultado era que **las peticiones se serializaban en fila india**:
- Si la Petición 1 tardaba 3 segundos en generar respuesta con el modelo de OpenAI/Anthropic, la Petición 2 esperaba 3 segundos antes de siquiera comenzar.
- La Petición 10 esperaba 27 segundos en la cola interna.
- La Petición 11 alcanzaba el timeout de 30 segundos del proxy de Drupal y moría con un error 504.

El techo máximo medido era de apenas **10 consultas por minuto**. Ante el anuncio a 25.000 usuarios, el sistema colapsaría en los primeros diez segundos de lanzamiento.

---

## 3. Los hallazgos complementarios: sin rate limit ni contención

La auditoría de 72 horas reveló tres fallos adicionales:
1. **Ausencia total de Rate Limiting:** Un solo usuario abriendo cinco pestañas y pulsando enviar podía monopolizar el único worker del contenedor.
2. **Timeouts asimétricos:** El proxy de Drupal cortaba la conexión a los 30 segundos, pero el contenedor de Python seguía procesando la respuesta con el LLM en segundo plano hasta completarla, consumiendo dinero y cuota de API por una respuesta que el usuario nunca vería.
3. **Falta de streaming SSE:** Las respuestas se enviaban como un único payload JSON final tras completarse la generación, lo que disparaba la percepción de lentitud del usuario.

---

## 4. La remediación de emergencia en 48 horas

Para evitar el colapso sin reescribir la aplicación desde cero:

### Paso 1: Multi-worker con Gunicorn + UvicornWorker
Cambiamos la forma de ejecución del contenedor para aprovechar todos los núcleos de CPU del nodo de Kubernetes:

```dockerfile
# Ejecución con múltiples workers asíncronos y timeout estricto
CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000", "--timeout", "60"]
```

### Paso 2: Rate Limiting en el proxy inverso
Configuramos una política de rate limit estricta en el proxy de Drupal y en NGINX:
- Máximo 3 peticiones por minuto por usuario autenticado.
- Las peticiones excedentes reciben un mensaje informativo: *«El asistente está procesando muchas consultas, por favor espera 20 segundos»*, liberando la cola del backend.

### Paso 3: Escalado horizontal en Kubernetes (HPA)
Definimos un Horizontal Pod Autoscaler configurado para escalar de 2 a 8 pods en cuanto el consumo de CPU superara el 65% o el tiempo de respuesta promedio subiera de 4 segundos.

---

## 5. El día del lanzamiento

El jueves a las 09:00 se envió el comunicado. Durante la primera hora el sistema atendió más de 1.800 consultas concurrentes:
- Los pods escalaron automáticamente a 6 réplicas.
- La tasa de error fue del **0.05%** (solo 2 fallos atribuibles a cuotas de OpenAI).
- El tiempo de respuesta promedio se mantuvo en 2.4 segundos.

---

## 6. Lecciones aprendidas

1. **No existe tal cosa como un 'POC' si tiene fecha de lanzamiento:** Si un prototipo va a ser tocado por usuarios reales, trátalo como código de producción desde el primer día. Las pruebas de carga deben realizarse semanas antes, no horas antes.
2. **FastAPI no es mágico:** Si tu código asíncrono ejecuta funciones bloqueantes dentro de los endpoints, Uvicorn bloqueará el Event Loop para todos los demás clientes concurrentes.
3. **Cancela las tareas huérfanas en el backend:** Si el cliente cierra la conexión HTTP por timeout, tu servidor debe escuchar la desconexión (`request.is_disconnected()`) y abortar inmediatamente la llamada al modelo para no desperdiciar cómputo ni presupuesto.
"""
}

# -------------------------------------------------------------
# Post 14: rotacion-llaves-sops-kms-secretos-huerfanos
# -------------------------------------------------------------
posts["rotacion-llaves-sops-kms-secretos-huerfanos"] = {
    "title": "La llave vieja que alguien seguía usando: rotación de llaves SOPS/KMS sin caídas operativas",
    "date": "2026-10-10",
    "category": "Criptografía & Cloud",
    "excerpt": "Rotar la llave maestra que descifra los secretos de todos los clústeres de Kubernetes parecía completo y validado en CI y ArgoCD. Pero justo antes de destruirla, CloudTrail reveló que un ingeniero la seguía utilizando desde su laptop. Guía para rotar secretos de infraestructura sin romper nada.",
    "coverImage": "/blog-posts/images/oxker.png",
    "coverAlt": "Cifrado de datos en la nube, rotación de llaves criptográficas KMS y seguridad en Kubernetes",
    "body": f"""{WARNING_CALLOUT}

---

En seguridad de infraestructura hay un principio que todo SRE aprende por las malas: **nunca destruyas una credencial antigua solo porque crees que ya nadie la usa; deja que la telemetría te demuestre que nadie la está llamando.**

A finales de septiembre iniciamos la rotación programada del usuario IAM `sops` en AWS. Este usuario posee los permisos de descifrado sobre las llaves de **AWS KMS** utilizadas por la herramienta **SOPS** (*Secrets OPerationS*) para cifrar todos los archivos de configuración (`values.yaml`, secretos de bases de datos, tokens de API) que gestionan nuestros clústeres de Kubernetes con GitOps (ArgoCD) y nuestros pipelines de CI/CD.

La rotación de la llave nueva en ArgoCD y en los flujos de integración continua fue un éxito impecable. Estábamos listos para eliminar la llave vieja en la consola de AWS.

Sin embargo, al ejecutar una última consulta de auditoría en **AWS CloudTrail**, la telemetría arrojó una sorpresa: **alguien del equipo había realizado 32 operaciones de descifrado con la llave vieja hacía menos de 18 horas desde una máquina portátil.**

---

## 1. El mapa de consumidores: la telaraña de SOPS

Antes de rotar una llave que cifra secretos de infraestructura es obligatorio construir un mapa exhaustivo de dependencias. En nuestra arquitectura, la llave KMS era consumida por:

1. **ArgoCD en producción y desarrollo:** El componente `repo-server` monta el secreto `aws-credentials` y ejecuta SOPS al vuelo para descifrar los manifiestos de Helm antes de aplicarlos en el clúster.
2. **Secretos de Organización en GitHub Actions:** Variables `SOPS_AWS_ACCESS_KEY_ID` inyectadas en 6 pipelines diferentes de despliegue continuo.
3. **Estaciones de trabajo de ingeniería:** Desarrolladores que ejecutan `sops -d secrets.yaml` localmente para modificar variables de entorno en sus ramas de trabajo.
4. **19 archivos de secretos cifrados en Git:** Archivos `values.yaml` en la rama `master` cuyos metadatos registraban el ARN de la clave KMS.

---

## 2. La regla de oro: Rotación en dos fases (*Add Before Remove*)

Para garantizar cero tiempo de inactividad, una rotación de credenciales nunca se hace reemplazando el valor en un solo paso destructivo:

```text
Fase 1: Generar Llave Nueva ──> Aprovisionar en Consumidores ──> Ventana de Coexistencia
                                                                        │
Fase 2: Validar en CloudTrail ──> Desactivar Llave Vieja ──> Esperar ──> Destruir
```

1. Se creó la `AccessKeyId` nueva (`AKIA...NEW`) manteniendo activa la antigua (`AKIA...OLD`).
2. Se actualizó el secreto en ArgoCD y se reinició el pod `argocd-repo-server`.
3. Se actualizaron los secretos de organización en GitHub Actions.
4. Se ejecutó un despliegue de prueba end-to-end en staging para comprobar que ArgoCD sincronizaba los cambios en estado `Synced`.

Todo parecía resuelto. La tentación de ejecutar `aws iam delete-access-key` era grande.

---

## 3. La sorpresa en CloudTrail: la llamada de las 19:04 UTC

Antes de pulsar el botón de borrado, ejecutamos una inspección de uso con AWS CLI:

```bash
$ aws iam get-access-key-last-used --access-key-id AKIA...OLD
{{
    "UserName": "sops",
    "AccessKeyLastUsed": {{
        "LastUsedDate": "2026-09-30T19:04:12+00:00",
        "ServiceName": "kms",
        "Region": "us-east-1"
    }}
}}
```

La llave vieja había sido utilizada **el día anterior a las 19:04 UTC**.

Consultamos los eventos crudos de auditoría en CloudTrail:

```bash
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=AccessKeyId,AttributeValue=AKIA...OLD \
  --query "Events[*].[EventTime,EventName,SourceIPAddress,UserAgent]" \
  --output table
```

```text
-------------------------------------------------------------------------------------
|                                   LookupEvents                                    |
+----------------------+------------+------------------+----------------------------+
| 2026-09-30T19:04:12Z | Decrypt    | 198.51.100.25    | aws-sdk-go-v2/1.30.3 macOS |
| 2026-09-30T18:55:01Z | Decrypt    | 198.51.100.25    | sops/v3.9.0 (darwin/arm64) |
| 2026-09-30T18:40:22Z | DescribeKey| 198.51.100.25    | aws-cli/2.17.42 Python/3.11|
+----------------------+------------+------------------+----------------------------+
```

La telemetría fue concluyente:
- El `User-Agent` indicaba un binario SOPS compilado para arquitectura Apple Silicon (`darwin/arm64`).
- La IP pertenecía al túnel VPN de un desarrollador sénior del equipo.

Si hubiéramos destruido la llave inmediatamente, habríamos roto el entorno local del ingeniero a mitad de una tarea crítica de despliegue.

---

## 4. La comunicación y el cierre seguro

Contactamos al ingeniero: estaba preparando un hotfix en una rama local y su archivo `~/.aws/credentials` seguía apuntando al perfil con la clave vieja.

El protocolo de cierre se ejecutó de forma ordenada:
1. El ingeniero actualizó sus credenciales locales a la llave nueva.
2. En lugar de borrar la llave en AWS, **la cambiamos a estado inactivo (`Inactive`)**:
   ```bash
   aws iam update-access-key --access-key-id AKIA...OLD --status Inactive --user-name sops
   ```
3. Se mantuvo en cuarentena durante 72 horas. Si algún proceso oculto hubiera fallado, reactivarla habría tomado dos segundos.
4. Tras tres días con cero intentos de acceso fallidos en CloudTrail, se procedió a la destrucción física de la credencial:
   ```bash
   aws iam delete-access-key --access-key-id AKIA...OLD --user-name sops
   ```

---

## 5. Lecciones aprendidas

1. **`get-access-key-last-used` es tu salvavidas:** Antes de borrar cualquier credencial en AWS, revisa siempre cuándo y desde qué servicio fue invocada por última vez.
2. **CloudTrail no miente:** El User-Agent en los eventos de CloudTrail te dice con exactitud si quien llama es un pod de Kubernetes, un runner de GitHub Actions o la laptop de un compañero de equipo.
3. **Desactiva antes de eliminar:** El estado `Inactive` en IAM es una red de seguridad gratuita. Una llave inactiva no puede usarse, pero te permite dar marcha atrás en segundos si descubres una dependencia huérfana de madrugada.
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

print(f"Batch 2 complete: {len(posts)} posts generated.")
