---
title: "MkDocs: Por qué la simpleza gana al documentar proyectos (y el caso real de mis dotfiles)"
date: "2026-10-12"
category: "Herramientas & Docs"
excerpt: "Escribir documentación en Markdown puro y desplegarla como sitio estático sin lidiar con configuraciones complejas. Por qué MkDocs es mi opción predilecta y cómo lo uso para documentar mis dotfiles."
coverImage: "/blog-posts/images/vim.png"
coverAlt: "Documentación de proyectos y archivos Markdown en terminal"
---

Uno de los mayores axiomas en la ingeniería de software es que **la mejor documentación es la que realmente se escribe y se mantiene**.

Con frecuencia, los equipos caen en la trampa de adoptar herramientas de documentación excesivamente sofisticadas: generadores de sitios basados en complejos frameworks de JavaScript, gestores de contenido con bases de datos o plataformas propietarias pesadas. El resultado suele ser predecible: la barrera de entrada para actualizar una página es tan alta que la documentación queda desactualizada en cuestión de semanas.

En este artículo quiero hablar sobre **MkDocs**, una herramienta que ha resuelto este problema para mí gracias a una virtud fundamental: **la simpleza radical**. Compartiré además un caso de uso real donde lo tengo desplegado y funcionando sin fricción: la wiki de mis [dotfiles](https://github.com/zer0sh/dotfiles).

Como siempre, **esta postura representa mi experiencia subjetiva y lo que a mí me funciona en el día a día; no pretende ser una verdad universal ni desacreditar otras alternativas excelentes.**

---

## 1. La filosofía de MkDocs: Markdown puro y nada más

A diferencia de otras soluciones que exigen entender React, Vue o sistemas de componentes avanzados, MkDocs se mantiene fiel a la esencia del desarrollador:

- **Tus documentos son simples archivos `.md`:** Puedes editarlos con `vim`, `nano`, VS Code o desde la propia interfaz de GitHub.
- **Configuración centralizada en un archivo `mkdocs.yml`:** La navegación, plugins y metadatos se definen en pocas líneas legibles.
- **Generador estático veloz escrito en Python:** Compila cientos de páginas en una fracción de segundo en HTML puro y CSS, sin dependencias de runtime ni servidores dinámicos que parchar.

```yaml
site_name: Dotfiles Wiki
site_description: Configuración declarativa de estación de trabajo Unix
theme:
  name: material
  palette:
    scheme: slate
    primary: teal
    accent: emerald
  features:
    - navigation.tabs
    - search.suggest
    - search.highlight

markdown_extensions:
  - pymdownx.highlight
  - pymdownx.superfences
  - admonition
```

---

## 2. El estándar de oro: Material for MkDocs

El verdadero salto de calidad al usar MkDocs viene de la mano de su tema más popular: **Material for MkDocs**.

Sin necesidad de escribir una sola línea de CSS personalizado, obtienes de serie:
1. **Búsqueda instantánea en el cliente:** Un motor de búsqueda integrado que indexa todo tu contenido y filtra resultados en milisegundos mientras escribes.
2. **Modo oscuro nativo:** Adaptado a las preferencias del sistema del usuario.
3. **Bloques de código avanzados:** Con resaltado de sintaxis, numeración de líneas y botón para copiar al portapapeles.
4. **Diseño completamente responsive:** Se lee con perfecta claridad tanto en un monitor de 27 pulgadas como en la pantalla de un teléfono móvil.

---

## 3. Caso de uso real: La documentación viva de mis Dotfiles

Mi entorno de trabajo principal es un escritorio Linux declarativo basado en **Hyprland, Wayland y la shell POSIX**. Gestionar combinaciones de teclas modales, reglas de ventanas, scripts de telemetría de hardware y configuraciones de terminal suele ser complejo de memorizar a largo plazo.

En lugar de dejar notas dispersas o un README kilométrico e inmanejable, decidí estructurar toda la documentación de mi sistema con MkDocs dentro del propio repositorio de [dotfiles](https://github.com/zer0sh/dotfiles).

### La ventaja del despliegue automatizado:

Cada vez que modifico una configuración o agrego un nuevo script y hago un `git push` a la rama principal, un flujo automatizado de GitHub Actions de apenas unas líneas compila el sitio y lo publica directamente en GitHub Pages:

```yaml
name: Deploy MkDocs Wiki

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: 3.x
      - run: pip install mkdocs-material
      - run: mkdocs gh-deploy --force
```

El resultado es una **wiki pública, accesible desde cualquier dispositivo y en cualquier lugar del mundo**, donde puedo consultar rápidamente mis atajos de teclado, mis scripts de instalación y mis notas de configuración sin tener que abrir el código fuente en sucio.

---

## Conclusión

Existen muchas herramientas válidas en el ecosistema: Sphinx es potente para proyectos con documentación de código fuente en Python, Docusaurus es excelente para equipos fuertemente arraigados en React, y VitePress tiene su espacio en el mundo Vue.

Sin embargo, para proyectos personales, documentación interna de infraestructura, runbooks operativos y guías técnicas de equipos, **MkDocs ofrece la curva de fricción más baja que conozco**. Si quieres que tu equipo realmente mantenga viva la documentación, facilítales el camino: un archivo Markdown, un commit y un sitio web impecable.
