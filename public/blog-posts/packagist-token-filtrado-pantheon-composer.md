---
title: "El token de Packagist que vivió tres años en producción: por qué borrar el archivo no bastó"
date: "2026-09-12"
category: "Seguridad & Secretos"
excerpt: "Un token de nuestro repositorio privado de paquetes estuvo expuesto en texto plano en tres repositorios desde 2023. Lo verdaderamente revelador no fue encontrarlo, sino descubrir que la plataforma cloud lo regeneraba en cada build y lo servía por HTTP en el borde ignorando .htaccess."
coverImage: "/blog-posts/images/opencode.png"
coverAlt: "Auditoría de seguridad y gestión de secretos en integración continua"
---

> [!WARNING] **Nota de confidencialidad y contexto:**  
> *Los nombres de organizaciones, proyectos, identificadores de red y credenciales han sido anonimizados por motivos de seguridad y confidencialidad operativa. La arquitectura técnica, la cronología de eventos, los comandos ejecutados, los diagnósticos y las lecciones aprendidas corresponden a un incidente real vivido en producción.*


---

En auditorías de seguridad en la nube hay una regla silenciosa: **encontrar un secreto expuesto es solo el 20% del trabajo; entender cómo la plataforma de hosting lo almacena, compila y sirve al público es el 80% restante.**

Durante una revisión rutinaria de dependencias para varios portales WordPress corporativos alojados en una plataforma PaaS (Pantheon), nos topamos con un hallazgo alarmante: un archivo `auth.json` con credenciales de lectura y descarga de nuestro repositorio privado de paquetes PHP (**Packagist**) llevaba comiteado en la rama principal de tres repositorios desde 2023.

Cualquiera con acceso a los repositorios o que consultara la ruta web directa podía obtener el token y descargar código propietario de decenas de módulos internos.

Esta es la historia de cómo contuvimos la brecha, por qué eliminar el archivo de Git y bloquearlo con `.htaccess` fracasó estrepitosamente, y la solución definitiva a nivel de arquitectura de plataforma.

---

## 1. El hallazgo y el radio de impacto

El archivo `auth.json` es la convención que utiliza Composer para autenticarse contra repositorios protegidos. En los tres proyectos afectados, el archivo residía en la raíz del repositorio:

```json
{
  "http-basic": {
    "repo.packagist.com/acme-corp/": {
      "username": "token",
      "password": "ghp_xxxxxxxxxxxxxxxxxxxxxxEXAMPLE"
    }
  }
}
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
$ curl -s -o /dev/null -w "%{http_code}\n" https://portal-dental.ejemplo.org/auth.json
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
