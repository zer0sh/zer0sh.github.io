# 🌐 Zero Portfolio

Portfolio personal construido con React, enfocado en diseño, animaciones
y una experiencia fluida.

------------------------------------------------------------------------

## 🚀 Tecnologías

-   React
-   JavaScript (ES6+)
-   CSS / Tailwind (si aplica)
-   GitHub Pages (deploy)

------------------------------------------------------------------------

## ⚙️ Instalación

Clona el repositorio e instala dependencias:

``` bash
git clone https://github.com/zer0sh/zer0sh.github.io.git
cd zer0sh.github.io
npm install
```

------------------------------------------------------------------------

## ▶️ Ejecutar en desarrollo

``` bash
npm start
```

La app estará disponible en:

http://localhost:3000

------------------------------------------------------------------------

## 🏗️ Build para producción

``` bash
npm run build
```

Esto generará la carpeta:

/build

------------------------------------------------------------------------

## 🌍 Deploy (GitHub Pages)

Este proyecto se despliega automáticamente usando GitHub Actions.

### Flujo:

1.  Hacer cambios\
2.  Commit y push:

``` bash
git add .
git commit -m "update"
git push origin main
```

3.  GitHub Actions:
    -   construye el proyecto
    -   publica en la rama `gh-pages`

------------------------------------------------------------------------

## ⚠️ Rutas en GitHub Pages

Este proyecto usa `HashRouter` para evitar problemas de rutas.

Ejemplo:

https://zer0sh.github.io/#/es

------------------------------------------------------------------------

## 🌙 Tema

-   🌞 Light (Naruto theme)\
-   🌑 Dark (Obito theme)

El tema se guarda en `localStorage`.

------------------------------------------------------------------------

---

## 📝 Blog

El blog usa archivos Markdown planos en `public/blog-posts/`.  
Se renderizan con `react-markdown` + `remark-gfm`.

### Crear un post nuevo

```bash
npm run new-post
```

Sigue las instrucciones interactivas (slug, título, categoría, extracto, imagen de portada).

### Estructura de un post

```markdown
---
title: "Título del post"
date: "2026-05-08"
category: "DevOps"
excerpt: "Breve descripción para la lista"
coverImage: "/blog-posts/images/portada.jpg"   # opcional
coverAlt: "Descripción de la portada"            # opcional
---

Contenido del post en Markdown.
```

### Imágenes

- **Portada**: se define en el frontmatter (`coverImage`) y se muestra al entrar al post.
- **Inline**: se renderizan con caption si tienen `title`, loading lazy y bordes redondeados.

```
![Descripción](/blog-posts/images/ejemplo.jpg)
```

```
![Descripción](/blog-posts/images/ejemplo.jpg "Texto del caption")
```

### Generar el índice

El `index.json` se genera automáticamente antes del build:

```bash
npm run generate-index
# o simplemente:
npm run build
```

### Documentación completa

Ver [`docs/blog.md`](./docs/blog.md).

---

## 📸 Capturas

Vista principal del home (`/en`):

![Home](/docs/screenshots/home.png)

---

## 🧪 Problemas conocidos

-   Algunas vulnerabilidades provienen de dependencias internas
    (`react-scripts`)
-   No afectan el funcionamiento del proyecto

------------------------------------------------------------------------

## 📦 Estructura

    src/
     ├── components/
     ├── context/
     ├── pages/
     ├── styles/
     └── App.jsx

------------------------------------------------------------------------

## ✨ Autor

Steven Muñoz
