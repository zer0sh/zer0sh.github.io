#!/usr/bin/env python3
"""
Generator script for real-world SRE & security incident blog posts (Batch 3).
"""

import os

POSTS_DIR = "/home/zero/Workspace/personal/zer0-sh.github.io/public/blog-posts"
os.makedirs(POSTS_DIR, exist_ok=True)

WARNING_CALLOUT = """> [!WARNING] **Nota de confidencialidad y contexto:**  
> *Los nombres de organizaciones, proyectos, identificadores de red y credenciales han sido anonimizados por motivos de seguridad y confidencialidad operativa. La arquitectura técnica, la cronología de eventos, los comandos ejecutados, los diagnósticos y las lecciones aprendidas corresponden a un incidente real vivido en producción.*
"""

posts = {}

# -------------------------------------------------------------
# Post 15: beaver-builder-wp-rocket-estilos-dinamicos-corruptos
# -------------------------------------------------------------
posts["beaver-builder-wp-rocket-estilos-dinamicos-corruptos"] = {
    "title": "El botón que cambió de color solo: especificidad CSS, :where() en WordPress y la trampa del Critical CSS",
    "date": "2026-10-06",
    "category": "Frontend & Performance",
    "excerpt": "El botón principal de contacto de una firma legal pasó de blanco a gris oscuro sobre fondo azul sin que nadie hubiera editado la página. La causa: un cambio de una sola palabra (:where) en la actualización menor de un plugin de maquetación y una regla de Critical CSS desactualizada.",
    "coverImage": "/blog-posts/images/opencode.png",
    "coverAlt": "Arqueología de CSS, especificidad en navegadores y caché de frontend en producción",
    "body": WARNING_CALLOUT + """\n\n---\n\nEn desarrollo web hay bugs que desconciertan porque nadie ha tocado el código:  
*«Les juro que nadie ha entrado al panel de administración ni ha hecho commits en la página de inicio desde el año pasado»*.

Esto fue lo que reportó el equipo de control de calidad en el portal de **Proyecto LexFirm**: el botón principal de llamada a la acción (*«CONTACT US TODAY»*) de la cabecera había cambiado misteriosamente de color. Su texto, que históricamente era de un blanco nítido sobre fondo azul marino, ahora se mostraba en un gris oscuro apagado (`#333333`), arruinando el contraste y violando los estándares de accesibilidad WCAG AA.

La investigación nos llevó a una verdadera sesión de **arqueología de CSS**, donde tres capas independientes de optimización y maquetación chocaron tras una actualización automática de dependencias.

---

## 1. La inspección con Playwright: buscando al culpable

Abrimos una sesión headless con Playwright para inspeccionar el árbol del DOM y la cascada de estilos computados en vivo:

```text
<div class="fl-module-button">
  <a class="fl-button" href="/contact">
    <span class="fl-button-text">CONTACT US TODAY</span>
  </a>
</div>
```

Al desglosar las reglas CSS aplicadas sobre el elemento `span.fl-button-text`:

1. El elemento `a.fl-button` tenía `color: #ffffff`.
2. Pero el elemento interno `span.fl-button-text` recibía de forma prioritaria:
   ```css
   /* fl-builder-layout-button-defaults.css */
   .fl-builder-content .fl-button:is(a, button) * {{
       color: #333333;
   }}
   ```

El `#333333` venía de la hoja de estilos base del maquetador visual (*Beaver Builder*), que se carga cuando el tema activo no es el tema predeterminado del fabricante.

---

## 2. La pregunta del millón: ¿por qué antes se veía blanco?

Si esa regla de `#333333` siempre había existido en el plugin, ¿por qué durante más de un año el texto se vio blanco sin problemas?

Revisamos el historial de Git del plugin en `composer.lock`. El sitio había recibido una actualización automática menor de Beaver Builder de la versión `2.10` a la `2.11`.

Al hacer un `diff` minucioso del archivo `row-css.php` entre ambas versiones, saltó la liebre:

```diff
- /* Versión 2.10: */
- .fl-row-content *:not(input):not(select):not(textarea):not(a) {{ color: inherit; }}

+ /* Versión 2.11: */
+ :where(.fl-row-content *:not(input):not(select):not(textarea):not(a)) {{ color: inherit; }}
```

### El poder destructor de `:where()`
La pseudo-clase CSS `:where()` tiene una propiedad matemática fundamental: **su especificidad es siempre CERO `(0, 0, 0)`**, sin importar cuántos selectores contenga en su interior.

- En la versión **2.10**, la regla de herencia de color de la fila tenía una especificidad de clase `(0, 1, 0)`. Como la fila tenía configurado el color blanco, esa regla le ganaba a los estilos por defecto y el `span` heredaba el blanco del enlace `<a>`.
- En la versión **2.11**, los desarrolladores del plugin envolvieron la regla en `:where(...)` para evitar sobreescribir estilos de temas modernos. Al reducir su especificidad a `(0, 0, 0)`, **la regla de `#333333` pasó a ganar la cascada automáticamente**.

Nadie había editado la página: el cambio de una sola función en el core del maquetador alteró el resultado en todo el sitio.

---

## 3. El parpadeo de Critical CSS

Para añadir dramatismo al incidente, algunos usuarios reportaban un comportamiento intermitente: el botón cargaba en blanco por medio segundo y luego parpadeaba a gris oscuro.

Esto se debía al plugin de optimización de rendimiento (WP Rocket):
1. **Critical CSS incrustado:** El HTML inicial contenía el CSS crítico generado meses atrás con la versión 2.10 (mostrando blanco).
2. **Carga diferida:** Al terminar de descargar los archivos CSS asíncronos en segundo plano, la versión 2.11 tomaba el control del renderizado y pintaba el texto de gris en las narices del usuario.

---

## 4. La solución: especificidad controlada a nivel de tema

Para blindar la interfaz contra futuras actualizaciones del maquetador, implementamos una regla definitiva en la hoja de estilos del tema hijo:

```css
/* Corrección de herencia determinista para botones del maquetador */
.fl-builder-content .fl-button:is(a, button) .fl-button-text {{
    color: inherit !important;
}}
```

Adicionalmente:
1. Regeneramos el archivo de Critical CSS en el plugin de caché.
2. Purgamos la caché de Cloudflare a nivel de borde.
3. Agregamos una prueba de regresión visual automatizada con Playwright que verifica el valor computado `getComputedStyle(buttonText).color === 'rgb(255, 255, 255)'` en cada despliegue.

---

## 5. Lecciones aprendidas

1. **Cuidado con las actualizaciones menores semánticas:** Las librerías de frontend y plugins a menudo introducen cambios en la especificidad de CSS (como adoptar `:where()` o `:is()`) en versiones *minor* que no rompen sintaxis pero alteran la cascada visual.
2. **El Critical CSS es un arma de doble filo:** Si optimizas la carga con CSS crítico generado estáticamente, debes invalidar y reconstruir esa caché cada vez que actualices temas o plugins de maquetación.
3. **Automatiza la validación de contraste:** Un test con Playwright o Axe Core en tu pipeline de CI detecta fallos de contraste en segundos antes de que los clientes noten botones ilegibles.
"""
}

# -------------------------------------------------------------
# Post 16: runners-github-actions-rbac-cluster-dev
# -------------------------------------------------------------
posts["runners-github-actions-rbac-cluster-dev"] = {
    "title": "Los runners de CI que podían leer todos los secretos: RBAC engañoso y evaluación de riesgo marginal",
    "date": "2026-09-29",
    "category": "Kubernetes & CI/CD",
    "excerpt": "Durante una auditoría de credenciales descubrimos que la ServiceAccount de los runners autohospedados de GitHub Actions tenía permisos para listar todos los secretos del clúster de desarrollo, pese a llamarse 'no-permission'. Crónica de cómo evaluar la exposición marginal real sin caer en alarmismos.",
    "coverImage": "/blog-posts/images/k9s.png",
    "coverAlt": "Auditoría de seguridad en Kubernetes, RBAC y control de acceso en clústeres",
    "body": WARNING_CALLOUT + """

---

En seguridad ofensiva y defensiva hay una línea muy delgada entre **un hallazgo alarmante en papel y una vulnerabilidad con impacto marginal real**.

A finales de septiembre, mientras realizábamos una auditoría de rotación de tokens de Cloudflare en nuestros clústeres de Kubernetes, nos topamos con una configuración de RBAC (*Role-Based Access Control*) que encendió todas las alertas: la cuenta de servicio (`ServiceAccount`) asignada a los runners autohospedados de **GitHub Actions** (gestionados mediante *Actions Runner Controller* - ARC) tenía permisos para listar y leer **todos los secretos y pods de todos los namespaces del clúster de desarrollo**.

El nombre de la cuenta era una ironía involuntaria: `self-hosted-linux-gha-rs-no-permission`.

La primera reacción instintiva fue calificar el hallazgo como un riesgo crítico de severidad alta. Sin embargo, al sentarnos a modelar el impacto marginal con el arquitecto del sistema, el análisis se transformó en una valiosa lección de evaluación pragmática de amenazas.

---

## 1. La anatomía del hallazgo en Kubernetes

Al inspeccionar los enlaces de roles a nivel de clúster con `kubectl`:

```bash
$ kubectl get clusterrolebindings | grep gh-actions
gh-actions-wp-en                     ClusterRole/cluster-admin-reader   167d
gh-actions-wp-en-exec                ClusterRole/pod-exec-role          167d
```

Al desglosar los permisos reales con `kubectl auth can-i`:

```bash
$ kubectl auth can-i get secrets --as=system:serviceaccount:gh-actions-controller:self-hosted-linux-gha-rs-no-permission -A
yes

$ kubectl auth can-i list pods --as=system:serviceaccount:gh-actions-controller:self-hosted-linux-gha-rs-no-permission -A
yes

$ kubectl auth can-i create pods/exec --as=system:serviceaccount:gh-actions-controller:self-hosted-linux-gha-rs-no-permission -A
yes
```

La cuenta de servicio:
1. Tenía permiso para hacer `get` y `list` de cualquier `Secret` en cualquier namespace (incluyendo bases de datos de desarrollo, credenciales de Vault y llaves de prueba).
2. Tenía permiso para ejecutar comandos (`exec`) dentro de cualquier pod del clúster.
3. El token JWT de esa ServiceAccount venía **automáticamente montado en el sistema de archivos** de cada runner en `/var/run/secrets/kubernetes.io/serviceaccount/token`.
4. El contenedor de los runners corría con Docker-in-Docker (`dind`) en modo privilegiado.

Si un atacante lograba ejecutar código arbitrario a través de un Pull Request externo en un repositorio público, teóricamente podía leer el token de la ServiceAccount y tomar control de los contenedores del clúster.

---

## 2. La pregunta que cambió el análisis: ¿cuál es la exposición marginal real?

Cuando presenté el informe recomendando reescribir todo el RBAC de emergencia, el Líder de Arquitectura hizo una sola pregunta que detuvo la urgencia:  
*«¿Quién tiene acceso a estos runners hoy y qué secretos reciben ya por diseño?»*.

Nos sentamos a mapear la superficie real de ataque:

1. **Los runners estaban configurados a nivel de organización privada:** Ningún repositorio público tenía acceso a este grupo de runners; solo repositorios privados controlados por el equipo interno.
2. **Los runners ya recibían los secretos en sus variables de entorno:** El token de Cloudflare, las llaves de base de datos de desarrollo y los tokens de CI ya se inyectaban como variables de GitHub Actions en los jobs de compilación.
3. **El clúster de producción estaba 100% aislado:** El clúster `workspace-prod` no utilizaba runners autohospedados; todos los despliegues de producción eran orquestados por ArgoCD en modo *pull*, sin comunicación bidireccional desde los runners de desarrollo.

La conclusión técnica fue reveladora: **la exposición marginal no era la fuga de secretos de producción (los runners no los tenían), sino la falta del principio de mínimo privilegio en el entorno de desarrollo.**

---

## 3. La remediación: principio de mínimo privilegio (Least Privilege)

Aunque el riesgo inmediato era bajo, mantener privilegios sobredimensionados es una deuda técnica que termina en desastre ante cualquier error futuro.

### Paso 1: Eliminar el ClusterRoleBinding global
Destruimos el enlace a nivel de clúster:
```bash
kubectl delete clusterrolebinding gh-actions-wp-en
kubectl delete clusterrolebinding gh-actions-wp-en-exec
```

### Paso 2: RoleBinding acotado por Namespace
Los runners solo necesitaban gestionar pods dentro de su propio namespace de trabajo (`gh-actions-runners`). Creamos un `Role` restringido:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: gh-actions-runners
  name: runner-scoped-role
rules:
- apiGroups: [""]
  resources: ["pods", "pods/exec"]
  verbs: ["get", "list", "create", "delete"]
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get"] # Solo lectura puntual, sin permiso de listar todo
```

### Paso 3: Desactivar automountServiceAccountToken
En el manifiesto de los pods efímeros de los runners, deshabilitamos la inyección automática del token de Kubernetes:

```yaml
spec:
  automountServiceAccountToken: false
```

Si un job de CI no necesita interactuar con la API de Kubernetes, el token del clúster ni siquiera debe existir dentro del contenedor.

---

## 4. Lecciones aprendidas

1. **Los nombres en Kubernetes no son garantías:** Que una ServiceAccount se llame `no-permission` no significa nada. Verifica siempre con `kubectl auth can-i`.
2. **Distingue entre riesgo teórico y riesgo marginal:** Un hallazgo que parece catastrófico en un escaneo automatizado debe ponderarse contra el modelo de amenazas real: ¿quién puede explotarlo, desde dónde y qué gana que no tuviera ya?
3. **Desactiva `automountServiceAccountToken` por defecto:** El 95% de las aplicaciones y jobs en Kubernetes no necesitan hablar con la API del clúster. No les regales un token en `/var/run/secrets` a menos que sea estrictamente necesario.
"""
}

# -------------------------------------------------------------
# Post 17: netdata-awk-1996-incompatibilidad-posix
# -------------------------------------------------------------
posts["netdata-awk-1996-incompatibilidad-posix"] = {
    "title": "Netdata y el awk de 1996: cuando mawk rompe scripts de automatización en flotas mixtas",
    "date": "2026-10-01",
    "category": "Linux & Automatización",
    "excerpt": "Una tarea simple para configurar Netdata en localhost en 7 servidores falló de forma insólita: en dos hosts con Ubuntu legacy corría mawk 1.3.3 de 1996, el cual no reconoce clases POSIX ni anclas en gsub(), duplicando la configuración en lugar de reemplazarla. Crónica de compatibilidad profunda en Linux.",
    "coverImage": "/blog-posts/images/shell-builtins.png",
    "coverAlt": "Compatibilidad de utilidades POSIX, scripts de shell y versiones de awk en Linux",
    "body": WARNING_CALLOUT + """

---

En administración de sistemas heterogéneos hay una lección humillante que se repite generación tras generación: **asumir que comandos universales como `grep`, `sed` o `awk` funcionan igual en todos los servidores Linux es la receta perfecta para corromper archivos de configuración.**

A finales de septiembre ejecutamos una tarea de endurecimiento perimetral en nuestra flota de siete servidores en la nube: asegurar que el servicio de monitoreo en tiempo real **Netdata** escuchara exclusivamente en `127.0.0.1`, eliminando la exposición de su interfaz web en el puerto `19999` hacia internet.

Un asistente de inteligencia artificial generó un script de automatización con `awk` para modificar el archivo `/etc/netdata/netdata.conf`. El script pasó los tests automáticos de QA en un contenedor moderno de Ubuntu 24.04 y fue marcado como *QA PASS*.

Sin embargo, al ejecutar la prueba en seco (*dry-run*) en la flota real, **en dos de los servidores el script duplicó las directivas en lugar de reemplazarlas.**

El motivo era fascinante y desconcertante: esos dos servidores corrían **mawk 1.3.3, un binario compilado en 1996.**

---

## 1. La lógica del script: reemplazar la directiva de bind

El archivo de configuración de Netdata (`netdata.conf`) contiene cientos de líneas comentadas y directivas con sangría variable:

```ini
[web]
    # bind to = *
    bind to = 127.0.0.1
```

Para asegurar que la directiva `bind to` quedara configurada en localhost sin importar cómo estuviera escrita, el script utilizaba una expresión regular en `awk`:

```bash
awk '
BEGIN {{ in_web = 0; replaced = 0 }}
/^\\[web\\]/ {{ in_web = 1; print; next }}
/^\\[/ && !/^\\[web\\]/ {{ in_web = 0 }}
in_web && /^[[:space:]]*#?[[:space:]]*bind to[[:space:]]*=/ {{
    print "    bind to = 127.0.0.1"
    replaced = 1
    next
}}
{{ print }}
END {{
    if (!replaced) print "\\n[web]\\n    bind to = 127.0.0.1"
}}
' /etc/netdata/netdata.conf
```

La lógica utilizaba clases de caracteres POSIX estándar (`[[:space:]]`) para coincidir con espacios y tabulaciones, y el ancla `^` para asegurar el inicio de línea.

---

## 2. El fallo en la flota real: ¿por qué se duplicó?

En cinco servidores (Ubuntu 22.04 con GNU awk / `gawk 5.1`), el script reemplazó la directiva limpiamente.

Pero en los dos servidores restantes (`srv-horizonte-db` y `srv-faktur-db`), la salida generada fue:

```ini
[web]
    # bind to = *
    bind to = 127.0.0.1
    bind to = 127.0.0.1
```

¡La directiva no se reemplazaba durante el procesamiento y el bloque `END` agregaba una copia al final!

---

## 3. La arqueología del binario: mawk 1.3.3

Al ingresar a uno de los servidores con fallo y consultar la versión del intérprete:

```bash
$ awk -W version
mawk 1.3.3 Nov 1996, Copyright (C) Michael D. Brennan
compiled for linux-gnu with gcc
```

`mawk` es una implementación ultraligera y rápida de AWK escrita por Mike Brennan a mediados de los 90, que durante muchos años fue el paquete predeterminado `/usr/bin/awk` en instalaciones mínimas de Debian y Ubuntu.

La versión `1.3.3` de 1996 tiene dos limitaciones críticas documentadas en su código fuente en C:
1. **No soporta clases de caracteres POSIX:** Expresiones como `[[:space:]]` no son interpretadas como espacios en blanco; son tratadas literalmente como una clase que busca los caracteres `[`, `:`, `s`, `p`, `a`, `c`, `e`.
2. **Incompatibilidad con el ancla `^` en subexpresiones:** En ciertas combinaciones de expresiones regulares complejas, `mawk 1.3.3` ignora el ancla de inicio de línea dentro de contextos anidados.

Como la expresión `/^[[:space:]]*#?[[:space:]]*bind to/` buscaba la letra `:` en lugar de un espacio, **la condición nunca evaluaba como verdadera.** El script no reemplazaba la línea existente y el bloque `END` añadía una segunda directiva duplicada.

---

## 4. La solución universal y determinista

Para escribir un script que funcione de forma idéntica en GNU awk (`gawk`), `mawk 1.3.3`, `mawk 1.4` y `nawk` (BSD/macOS):

### Reemplazar clases POSIX por conjuntos tradicionales
En lugar de `[[:space:]]`, se utiliza `[ \t]`:

```awk
# Compatible con cualquier awk desde 1988 hasta hoy:
in_web && /^[ \\t]*#?[ \\t]*bind to[ \\t]*=/ {{
    print "    bind to = 127.0.0.1"
    replaced = 1
    next
}}
```

### Manejo seguro de archivos temporales
El script original también cometía otro error común: intentaba crear un archivo temporal en `/etc/netdata/` sin privilegios suficientes:

```bash
# Error en entornos con permisos estrictos:
mktemp "/etc/netdata/netdata.conf.XXXXXX" # Permission denied
```

Se corrigió para utilizar siempre el directorio temporal del sistema con variables de entorno estándar:

```bash
TMP_CONF=$(mktemp "${{TMPDIR:-/tmp}}/netdata.conf.XXXXXX")
awk '...' /etc/netdata/netdata.conf > "$TMP_CONF"
sudo install -m 644 -o root -g root "$TMP_CONF" /etc/netdata/netdata.conf
rm -f "$TMP_CONF"
```

---

## 5. Lecciones aprendidas

1. **Las pruebas en contenedores modernos engañan:** Un test en Ubuntu 24.04 o Debian Bookworm siempre correrá contra versiones modernas de utilidades. Tu infraestructura real suele tener servidores antiguos con paquetes heredados que se comportan de formas inesperadas.
2. **`[ \t]` es más portátil que `[[:space:]]`:** Si estás escribiendo scripts críticos de shell destinados a correr en flotas diversas de servidores Unix/Linux, prefiere los conjuntos de caracteres tradicionales compatibles con estándares de hace 30 años.
3. **El dry-run en producción no es negociable:** Antes de aplicar una mutación en masa con Ansible, scripts o herramientas automáticas, vuelca la salida en un archivo de comparación (`diff -u`) en un servidor real de cada generación de tu parque.
"""
}

# -------------------------------------------------------------
# Post 18: mergeado-no-es-aplicado-traefik-helmfile
# -------------------------------------------------------------
posts["mergeado-no-es-aplicado-traefik-helmfile"] = {
    "title": "Mergeado no es aplicado: la trampa de los PRs de infraestructura que viven en Git pero no en el clúster",
    "date": "2026-09-27",
    "category": "Kubernetes & GitOps",
    "excerpt": "Un Pull Request de actualización de Traefik v3 y políticas RBAC se mergeó a la rama principal de infra bajo la instrucción explícita de 'no aplicarlo aún'. La trampa: al no haber pipelines automáticos de helmfile, el siguiente ingeniero en ejecutar un apply arrastraría una redirección forzada a HTTPS sin saberlo.",
    "coverImage": "/blog-posts/images/k9s.png",
    "coverAlt": "Gestión de clústeres Kubernetes con Helmfile, GitOps y despliegues sincronizados",
    "body": WARNING_CALLOUT + """

---

En la filosofía GitOps existe un principio sagrado: **el repositorio Git es la única fuente de la verdad (*Single Source of Truth*), y el estado del clúster debe reflejar exactamente lo que dice la rama principal.**

¿Pero qué ocurre cuando ese principio se rompe por una decisión operativa a medias?

A finales de septiembre enfrentamos una situación delicada en el repositorio central de infraestructura (`infra`): un Pull Request complejo (PR `#46`) que actualizaba el ingress controller **Traefik** de la versión `28.1.0` (v3.0.0) a la `41.5.0` (v3.7.13), e introducía políticas estrictas de RBAC para el operador *reflector*.

El PR tenía conflictos con otra rama y requería una ventana de mantenimiento. El líder del equipo preguntó si era seguro mergearlo. La respuesta técnica fue tajante: *«No, no es seguro aplicarlo sin supervisión»*. 

Sin embargo, para destrabar el tablero de tareas, se tomó una decisión peligrosa:  
*«Déjalo mergeable y haz merge a master, pero no lo apliques en el clúster»*.

Esa simple acción dejó una bomba de tiempo lista para explotar en el siguiente comando de despliegue de cualquier compañero.

---

## 1. La anatomía del cambio pendiente

El repositorio utilizaba **Helmfile** para orquestar los releases de Kubernetes en nuestros dos clústeres: desarrollo (`workspace-dev`) y producción (`workspace-prod`).

A diferencia de herramientas como ArgoCD o Flux que sincronizan automáticamente en bucle cerrado, en este repositorio de infraestructura los despliegues de clúster base se ejecutaban manualmente por ingenieros autorizados mediante comandos locales:

```bash
helmfile -e prod apply
```

El PR `#46` introducía dos cambios arquitectónicos mayores:
1. **Salto de versión mayor de Traefik:** Migración de sintaxis en `values.yaml` y actualización de CRDs (`IngressRoute`).
2. **Encendido por defecto de redirección HTTP a HTTPS:** Una directiva que forzaba a todas las aplicaciones del clúster a responder con `301 Moved Permanently` si no recibían tráfico TLS.

Si alguien ejecutaba un `helmfile apply` general para actualizar otro servicio cualquiera (como `cert-manager` o `metrics-server`), **arrastraría el cambio de Traefik de forma involuntaria**.

---

## 2. El bug preexistente descubierto en el camino

Al preparar la resolución de conflictos en local descubrimos un fallo latente en el repositorio que nadie había notado:

```bash
$ helmfile -e prod template
in ./helmfile.yaml: failed to render template: 
nil pointer evaluating interface {}.tls_default_secret in k8s/base/traefik/values.yaml.gotmpl
```

El clúster de producción **nunca había definido la variable `tls_default_secret`**. Si alguien intentaba aplicar Traefik en producción, el comando ni siquiera podía compilar los manifiestos de Kubernetes.

Corregimos el template en `values.yaml.gotmpl` utilizando la función defensiva `get` de Go:

```yaml
# k8s/base/traefik/values.yaml.gotmpl
tls:
  defaultSecret: {{ .Values | get "tls_default_secret" "default/wildcard-tls-cert" | quote }}
```

Con eso, `helmfile -e prod diff` generaba una salida limpia y predecible.

---

## 3. La trampa operativa: ¿por qué 'mergear sin aplicar' es un antipatrón?

El PR se mergeó con éxito a `master` (commit `fe25fc9f`). En el tablero de gestión de proyectos la tarjeta pasó a color verde: *«Completado»*.

Pero en el mundo real de la infraestructura:
- En los clústeres seguía corriendo Traefik 28.1.0.
- En Git estaba versionado Traefik 41.5.0.
- **Git y el clúster estaban en estado de divergencia (*drift*) absoluto.**

Si otro ingeniero clonaba el repositorio dos días después para aplicar un parche de emergencia en un namespace no relacionado y corría:

```bash
helmfile apply
```

El comando compararía el estado local contra el clúster, detectaría la discrepancia de Traefik y aplicaría la actualización masiva de ingress en plena hora pico sin previo aviso.

---

## 4. La solución: desacoplamiento y documentación defensiva

Para neutralizar el riesgo creamos inmediatamente un runbook de protección: `docs/upgrade-traefik-2026-09.md`.

Adicionalmente, adoptamos dos salvaguardas técnicas:

### 1. Uso obligatorio de selectores (`-l`)
Establecimos como regla estricta que ningún ingeniero debe ejecutar `helmfile apply` global. Cada ejecución debe especificar el selector de la release deseada:

```bash
# Correcto: afecta exclusivamente a la aplicación en mantenimiento
helmfile -e prod -l name=cert-manager apply

# Prohibido en consola local:
helmfile -e prod apply
```

### 2. Bloqueo de releases no listas con `installed: false`
Si un componente está mergeado en Git pero no debe tocarse en producción hasta una fecha acordada, se congela explícitamente en el archivo de entorno:

```yaml
# environments/prod.yaml
releases:
  traefik:
    installed: false # Bloquea la aplicación accidental hasta la ventana autorizada
```

---

## 5. Lecciones aprendidas

1. **Si no está en el clúster, no está terminado:** Considerar un PR de infraestructura como "completado" solo porque se mergeó a Git es una ilusión peligrosa. Una tarea de SRE solo se cierra cuando el estado en producción coincide con el repositorio.
2. **El peligro de los despliegues manuales sin CI:** Si no tienes un agente GitOps (como ArgoCD) aplicando cambios de forma continua, el desfase entre ramas y clústeres es inevitable. El CI debe verificar el `diff` en cada commit.
3. **Nunca ejecutes `helmfile apply` sin selectores:** En clústeres con decenas de charts compartidos, correr un comando global es una ruleta rusa. Acota siempre el alcance de tu mutación con etiquetas (`-l`).
"""
}

# -------------------------------------------------------------
# Post 19: secret-scanning-push-protection-684-repos
# -------------------------------------------------------------
posts["secret-scanning-push-protection-684-repos"] = {
    "title": "161 de 684 repositorios: el comando CLI que truncó la auditoría de seguridad en silencio",
    "date": "2026-09-14",
    "category": "DevSecOps & Gobernanza",
    "excerpt": "Tras la filtración de un token de API, la directiva era activar Secret Scanning y Push Protection en toda la organización. La primera pasada reportó 'completado'... en solo 161 repos. Un límite por defecto en gh repo list silenció más de 500 repositorios. Crónica de automatización y verificación estricta.",
    "coverImage": "/blog-posts/images/opencode.png",
    "coverAlt": "Gestión de seguridad en GitHub Enterprise, escaneo de secretos y protección de código",
    "body": WARNING_CALLOUT + """

---

En automatización de seguridad hay un axioma fundamental: **nunca confíes en el código de salida `0` de un script si no has validado contra una fuente de verdad independiente cuántos elementos debían ser procesados.**

Este incidente se originó a raíz de la auditoría del token de Packagist que descubrimos expuesto en texto plano semanas atrás. Como medida preventiva institucional, la dirección de ingeniería emitió una directriz prioritaria:  
*«Activar Secret Scanning y Push Protection en absolutamente todos los repositorios de la organización en GitHub»*.

Un ingeniero de infraestructura escribió un script con el CLI oficial de GitHub (`gh`), lo ejecutó en su terminal y reportó en el canal de operaciones:  
*«Listo, protección activada en todos los repositorios»*.

Apenas doce horas después, un bot automatizado de auditoría interna de QA reabrió la tarea con un mensaje lapidario: **solo 161 repositorios tenían la protección activa. La organización tenía en realidad 684 repositorios.**

---

## 1. La trampa silenciosa de `gh repo list`

Al examinar el script original que ejecutó la primera pasada:

```bash
#!/usr/bin/env bash
# Script inicial con defecto de truncado
for repo in $(gh repo list mi-organizacion --json nameWithOwner -q '.[].nameWithOwner'); do
    echo "Habilitando protección en $repo..."
    gh api -X PATCH "repos/$repo" -f security_and_analysis[secret_scanning][status]=enabled
    gh api -X PATCH "repos/$repo" -f security_and_analysis[secret_scanning_push_protection][status]=enabled
done
```

A simple vista, el script recorre todos los repositorios devueltos por el comando `gh repo list`.

El problema técnico es que **`gh repo list` tiene un límite de paginación predeterminado de 200 resultados**. 

Si una organización tiene más de 200 repositorios, el comando **no arroja ningún error, no emite ninguna advertencia y no informa que la lista ha sido truncada**. Simplemente devuelve los primeros registros y termina con código de salida `0`.

Como la organización contaba con 684 repositorios (237 activos y 447 archivados), el script solo procesó una pequeña fracción y dejó a ciegas al 75% del código de la empresa.

---

## 2. El bot de QA que no acepta suposiciones

El héroe involuntario de este incidente fue nuestro bot interno de aseguramiento de calidad (*Workspace Agent*). 

El bot corre periódicamente en GitHub Actions y compara el estado deseado de las directivas de seguridad contra la API de GitHub:

```text
[AUDIT REPORT - SECRET SCANNING]
Total repos en organización: 684
Repositorios con Push Protection habilitado: 161
Repositorios desprotegidos: 523
ESTADO: FAILED - REABRIENDO TICKET DE SEGURIDAD
```

El bot detectó la discrepancia matemática de inmediato.

---

## 3. La segunda vuelta: el dilema de los repositorios archivados y los forks

Al corregir el parámetro de límite a `--limit 1000` para abarcar el universo real:

```bash
gh repo list mi-organizacion --limit 1000 --json isArchived,isFork,nameWithOwner
```

Aparecieron dos casos de borde que complicaron la ejecución:

### 1. Repositorios Archivados (`isArchived: true`)
En GitHub, un repositorio archivado está congelado en modo de solo lectura. Si intentas habilitar *Push Protection* mediante la API de GitHub:
```json
{{
  "message": "Repository was archived so is read-only.",
  "documentation_url": "https://docs.github.com/rest/repos/repos#update-a-repository"
}}
```
La llamada a la API devuelve `HTTP 403 Forbidden`. Por diseño de la plataforma, un repositorio archivado no puede recibir pushes, por lo que el riesgo de fuga activa de secretos es nulo.

### 2. Forks públicos de herramientas de código abierto
La organización mantenía dos forks públicos de librerías externas de inteligencia artificial. En la primera clasificación se pensó en aplicarles únicamente *Secret Scanning* (solo lectura) y no *Push Protection* para no interferir con las contribuciones upstream.

El bot de QA volvió a levantar la mano: tener una política diferenciada en repositorios públicos aumentaba el riesgo asimétrico. Si un desarrollador empujaba una rama con un secreto a un fork público, el daño era inmediato e irreparable.

---

## 4. La solución definitiva: script idempotente y cobertura al 100%

Diseñamos un script robusto que filtra por estado de archivo, maneja límites de rate limit en la API y verifica cada cambio:

```bash
#!/usr/bin/env bash
set -euo pipefail

ORG="mi-organizacion"
echo "Obteniendo universo completo de repositorios para $ORG..."

# Paginación completa con límite explícito alto
REPOS=$(gh repo list "$ORG" --limit 2000 --no-archived --json nameWithOwner -q '.[].nameWithOwner')

TOTAL=$(echo "$REPOS" | wc -l)
echo "Total de repositorios activos a proteger: $TOTAL"

COUNT=0
for repo in $REPOS; do
    COUNT=$((COUNT + 1))
    echo "[$COUNT/$TOTAL] Configurando protección en: $repo"
    
    gh api --silent -X PATCH "repos/$repo" \
      -F "security_and_analysis[secret_scanning][status]=enabled" \
      -F "security_and_analysis[secret_scanning_push_protection][status]=enabled" || {{
        echo "[!] Error al configurar $repo" >&2
      }}
done

echo "[OK] Cobertura completada exitosamente en los $TOTAL repositorios activos."
```

Al volver a ejecutar la auditoría del bot de QA:
```text
[AUDIT REPORT - SECRET SCANNING]
Repositorios activos evaluados: 237
Cobertura Push Protection: 100% (237/237)
ESTADO: COMPLIANT - TICKET CERRADO
```

---

## 5. Lecciones aprendidas

1. **Cuidado con los defaults de las herramientas CLI:** Muchas herramientas de línea de comandos (`gh`, `aws`, `kubectl`) truncan resultados o devuelven las primeras 50/100 filas por defecto para no saturar la terminal. En scripts de automatización, pasa siempre parámetros explícitos de límite o maneja paginación con cursores.
2. **Los bots de reconciliación son indispensables:** La automatización humana comete errores de alcance. Un bot independiente que audita la infraestructura contra la realidad sin sesgos es la mejor garantía de gobernanza.
3. **Reglas simples y universales superan a políticas complejas:** Intentar categorizar qué repositorios merecen protección completa y cuáles solo escaneo básico creó fricciones y huecos de seguridad. Proteger el 100% de los repositorios activos de forma uniforme eliminó el debate y cerró el riesgo.
"""
}

# -------------------------------------------------------------
# Post 20: hardening-ssh-sudoers-bloqueo-a-mitad-de-camino
# -------------------------------------------------------------
posts["hardening-ssh-sudoers-bloqueo-a-mitad-de-camino"] = {
    "title": "El sudo que se cortó a mitad de camino: cómo no bloquear tu propio script de hardening en Linux",
    "date": "2026-09-18",
    "category": "Linux & Hardening",
    "excerpt": "Durante el endurecimiento de accesos SSH y autenticación 2FA en un servidor de producción, el script retiró los privilegios de sudo al usuario que lo estaba ejecutando... antes de terminar la configuración. Crónica de una sesión al borde del abismo y cómo diseñar scripts de seguridad transaccionales.",
    "coverImage": "/blog-posts/images/shell-builtins.png",
    "coverAlt": "Consola Linux, configuración de sudoers y hardening de servidores SSH",
    "body": WARNING_CALLOUT + """

---

Hay momentos en la vida de un administrador de sistemas donde sientes un frío recorrerte la espalda. Ocurre exactamente en el instante en que presionas Enter en la terminal y ves aparecer:

```text
sudo: effective UID is not 0, is /usr/bin/sudo on a file system with the 'nosuid' option set or an NFS file system without root privileges?
[sudo] password for ubuntu: 
ubuntu is not in the sudoers file. This incident will be reported.
```

Y te das cuenta de que **el script que acabas de ejecutar retiró los permisos de superusuario a tu propia sesión activa antes de configurar la cuenta de reemplazo.**

Este incidente ocurrió durante el piloto de endurecimiento (*hardening*) de accesos SSH en el servidor principal de producción de **Proyecto Horizonte**. La meta era impecable: exigir autenticación en dos factores (2FA/TOTP) a los administradores humanos, crear un usuario de despliegue automatizado con privilegios estrictamente acotados y retirar los permisos de `sudo` total al usuario genérico `ubuntu`.

En el camino descubrimos cuatro trampas operativas que estuvieron a punto de dejarnos sin acceso al servidor en plena hora laboral.

---

## 1. El diseño del acceso: humanos con 2FA, CI con sudo acotado

El plan de seguridad acordado contemplaba tres pilares:

1. **Usuario humano administrador (`core-adm`):** 
   - Autenticación mediante llave SSH Ed25519 obligatoria.
   - Segundo factor TOTP (Google Authenticator) obligatorio al iniciar sesión en SSH (`pam_google_authenticator.so`).
   - Sudo total sin contraseña (`NOPASSWD`), ya que el acceso físico a la consola ya estaba validado con doble factor.
2. **Usuario de despliegue de CI (`app-deployer`):**
   - Sin acceso a 2FA (los pipelines de GitHub Actions no pueden responder desafíos interactivos).
   - Acceso restringido exclusivamente a los 5 comandos necesarios para desplegar versiones bajo `/srv/apps/releases/*` mediante alias específicos en `/etc/sudoers.d/`.
3. **Retiro de privilegios al usuario genérico `ubuntu`:**
   - La cuenta `ubuntu` (creada por defecto por el proveedor de cloud) debía ser despojada de su pertenencia al grupo `sudo`.

---

## 2. El primer tropiezo: dependencias ocultas en el deploy de producción

Antes de tocar una sola línea de configuración, decidimos auditar el script real de despliegue (`atomic-release.sh`) que ejecutaban los pipelines.

La sorpresa fue mayúscula: el pipeline de producción ejecutaba:

```bash
ssh ubuntu@node-prod "sudo mkdir -p /srv/apps/releases/v2026 && sudo chown -R www-data:www-data /srv/apps"
```

El despliegue automático **dependía directamente de que el usuario `ubuntu` tuviera permisos absolutos de superusuario sin restricciones**. Si le quitábamos el sudo a `ubuntu` sin reconfigurar previamente los pipelines, el siguiente despliegue de código caería en error crítico.

Diseñamos entonces una configuración quirúrgica en `/etc/sudoers.d/90-app-deploy`:

```sudoers
# Comandos estrictamente autorizados para el usuario de CI
Cmnd_Alias DEPLOY_CMDS = /bin/mkdir -p /srv/apps/releases/*, \
                         /bin/chown -R www-data\:www-data /srv/apps/releases/*, \
                         /usr/bin/rsync --server *, \
                         /srv/apps/bin/atomic-release.sh

app-deployer ALL=(root) NOPASSWD: DEPLOY_CMDS
```

Probamos la restricción con éxito: `app-deployer` podía ejecutar despliegues, pero si intentaba hacer `sudo whoami` o `sudo cat /etc/shadow`, el sistema rechazaba la orden.

---

## 3. El error de ejecución: el script que se corta la rama donde está sentado

Con el usuario nuevo configurado, procedimos a ejecutar el script final de limpieza. El script se corrió conectado por SSH como el usuario `ubuntu`:

```bash
#!/usr/bin/env bash
# Línea 45: Quitar a ubuntu del grupo sudo
sudo deluser ubuntu sudo

# Línea 50: Configurar permisos del módulo PAM de 2FA
sudo chmod 600 /etc/ssh/totp/core-adm.google_authenticator # <--- ¡FALLÓ AQUÍ!
```

El resultado fue inmediato:
- En la línea 45, `deluser ubuntu sudo` se ejecutó exitosamente con privilegios de root.
- A partir de ese microsegundo, **el usuario `ubuntu` dejó de ser administrador.**
- En la línea 50, cuando el script intentó ejecutar el siguiente `sudo chmod`, el sistema operativo denegó el comando:  
  *`ubuntu is not in the sudoers file. This incident will be reported.`*

El script se interrumpió abruptamente a la mitad. 

El nuevo usuario `core-adm` ya estaba creado, pero **sus permisos de archivo para el token 2FA no se habían fijado**. Si cerrábamos la sesión SSH actual, nos arriesgábamos a quedar bloqueados sin poder entrar por la cuenta vieja ni por la nueva.

---

## 4. El rescate y la regla de las dos terminales

Afortunadamente, el equipo aplicó una regla de oro de supervivencia que nos salvó: **la sesión SSH original nunca se cierra hasta comprobar el acceso en una segunda terminal independiente.**

En la terminal que aún tenía la sesión abierta ejecutamos una comprobación de sockets. Como la sesión de shell ya estaba autenticada, pudimos invocar la consola de rescate del proveedor de cloud (LISH/Consola Serial de Linode) que ingresa directamente como `root` a nivel de hipervisor sin pasar por el demonio SSH.

Desde allí se completó el ajuste:
```bash
# Reparación desde la consola física de rescate:
chmod 600 /etc/ssh/totp/core-adm.google_authenticator
chown core-adm:core-adm /etc/ssh/totp/core-adm.google_authenticator
systemctl restart sshd
```

En la segunda terminal probamos el login con el usuario nuevo:
```bash
ssh core-adm@servidor-prod.ejemplo.org
# Verification code: [Ingresamos el código de 6 dígitos de Google Authenticator]
# Welcome to Ubuntu 22.04 LTS (core-adm@servidor-prod)
$ sudo -n true && echo "Sudo NOPASSWD verificado exitosamente"
Sudo NOPASSWD verificado exitosamente
```

---

## 5. Lecciones aprendidas

1. **Nunca te quites tus propios privilegios en un script:** Si estás ejecutando un script con el usuario `A`, la revocación de permisos a ese usuario debe ser **la última línea del script**, o preferiblemente ejecutarse desde una cuenta independiente o consola de administración.
2. **La regla sagrada de las dos terminales:** Cuando modifiques configuraciones de SSH (`sshd_config`), PAM o `sudoers`, **jamás cierres la sesión en la que estás trabajando**. Abre una segunda ventana de terminal e intenta conectarte desde cero. Si algo falló, la primera sesión te permitirá reparar el daño sin downtime.
3. **Valida la sintaxis con `visudo -c`:** Nunca edites ni muevas archivos a `/etc/sudoers.d/` sin comprobar la integridad sintáctica antes de guardar:
   ```bash
   visudo -c -f /etc/sudoers.d/mi-configuracion
   ```
   Un solo error tipográfico en este directorio puede romper el comando `sudo` para todos los usuarios del sistema operativo.
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

print(f"Batch 3 complete: {len(posts)} posts generated.")
