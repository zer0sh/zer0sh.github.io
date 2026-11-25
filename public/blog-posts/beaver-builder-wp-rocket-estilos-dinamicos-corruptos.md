---
title: "El botón que cambió de color solo: especificidad CSS, :where() en WordPress y la trampa del Critical CSS"
date: "2026-10-06"
category: "Frontend & Performance"
excerpt: "El botón principal de contacto de una firma legal pasó de blanco a gris oscuro sobre fondo azul sin que nadie hubiera editado la página. La causa: un cambio de una sola palabra (:where) en la actualización menor de un plugin de maquetación y una regla de Critical CSS desactualizada."
coverImage: "/blog-posts/images/opencode.png"
coverAlt: "Arqueología de CSS, especificidad en navegadores y caché de frontend en producción"
---

> [!WARNING] **Nota de confidencialidad y contexto:**  
> *Los nombres de organizaciones, proyectos, identificadores de red y credenciales han sido anonimizados por motivos de seguridad y confidencialidad operativa. La arquitectura técnica, la cronología de eventos, los comandos ejecutados, los diagnósticos y las lecciones aprendidas corresponden a un incidente real vivido en producción.*


---

En desarrollo web hay bugs que desconciertan porque nadie ha tocado el código:  
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
