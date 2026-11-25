---
title: "Mergeado no es aplicado: la trampa de los PRs de infraestructura que viven en Git pero no en el clúster"
date: "2026-09-27"
category: "Kubernetes & GitOps"
excerpt: "Un Pull Request de actualización de Traefik v3 y políticas RBAC se mergeó a la rama principal de infra bajo la instrucción explícita de 'no aplicarlo aún'. La trampa: al no haber pipelines automáticos de helmfile, el siguiente ingeniero en ejecutar un apply arrastraría una redirección forzada a HTTPS sin saberlo."
coverImage: "/blog-posts/images/k9s.png"
coverAlt: "Gestión de clústeres Kubernetes con Helmfile, GitOps y despliegues sincronizados"
---

> [!WARNING] **Nota de confidencialidad y contexto:**  
> *Los nombres de organizaciones, proyectos, identificadores de red y credenciales han sido anonimizados por motivos de seguridad y confidencialidad operativa. La arquitectura técnica, la cronología de eventos, los comandos ejecutados, los diagnósticos y las lecciones aprendidas corresponden a un incidente real vivido en producción.*


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

El repositorio utilizaba **Helmfile** para orquestar los releases de Kubernetes en nuestros dos clústeres: desarrollo (`swapps-dev`) y producción (`swapps-prod`).

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
