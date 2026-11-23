# Blog — Documentación

## Vista general

El blog funciona con archivos Markdown planos alojados en `public/blog-posts/`.  
Se renderizan en el cliente usando `react-markdown` con `remark-gfm`.

No hay base de datos, CMS ni generación estática. Cada post es un `.md` con frontmatter YAML.

---

## Estructura de archivos

```
public/blog-posts/
├── index.json          # Índice generado automáticamente
├── images/             # Imágenes de los posts
│   ├── .gitkeep
│   └── Bienvenida.png
├── bienvenida.md       # Post de ejemplo
└── ...

scripts/
├── generate-post.js    # Genera un post nuevo (interactivo)
└── generate-index.js   # Escanea .md y genera index.json
```

---

## Frontmatter

Cada post debe comenzar con frontmatter YAML entre `---`:

```yaml
---
title: "Título del post"
date: "2026-05-08"
category: "DevOps"
excerpt: "Resumen corto para la lista del blog"
coverImage: "/blog-posts/images/portada.jpg"   # opcional
coverAlt: "Texto alternativo de la portada"     # opcional
---
```

### Campos

| Campo | Obligatorio | Descripción |
|---|---|---|
| `title` | Sí | Título del post |
| `date` | Sí | Fecha ISO (YYYY-MM-DD) |
| `category` | Sí | DevOps, Ciberseguridad, Desarrollo o General |
| `excerpt` | Sí | Texto corto que aparece en la lista |
| `coverImage` | No | Ruta a la imagen de portada |
| `coverAlt` | No | Texto alternativo para la portada |

### Categorías disponibles

| Categoría | Color |
|---|---|
| DevOps | Naranja |
| Ciberseguridad | Rojo |
| Desarrollo | Azul |
| General | Púrpura |

---

## Comandos

### `npm run new-post`

Crea un post nuevo de forma interactiva:

```bash
npm run new-post
```

Pide:
1. **Slug** — nombre del archivo (ej: `mi-post` → `mi-post.md`)
2. **Título** — visible en la lista y en el post
3. **Categoría** — DevOps, Ciberseguridad, Desarrollo o General
4. **Extracto** — resumen corto
5. **URL de imagen de portada** — opcional

Después de crear el archivo, regenera el índice automáticamente.

### `npm run generate-index`

Escanea todos los `.md` en `public/blog-posts/`, extrae el frontmatter y genera `public/blog-posts/index.json`.

```bash
npm run generate-index
```

Se ejecuta automáticamente antes de cada `npm run build`.

### `npm run build`

Compila el proyecto. Antes de compilar ejecuta `generate-index` para tener el índice actualizado.

```bash
npm run build
```

---

## Imágenes

### Portada del post

Se define en el frontmatter:

```yaml
coverImage: "/blog-posts/images/Bienvenida.png"
coverAlt: "Descripción de la imagen"
```

Se muestra automáticamente entre el título y el contenido cuando se abre el post.

### Imágenes inline

Se renderizan con el componente `img` personalizado que incluye:

- `loading="lazy"` para carga diferida
- Bordes redondeados (`rounded-2xl`)
- Sombra (`shadow-xl`)
- Borde sutil
- Caption opcional si el markdown incluye `title`

```markdown
![Descripción](/blog-posts/images/ejemplo.jpg)

![Descripción](/blog-posts/images/ejemplo.jpg "Este es el caption")
```

### Ubicación

Las imágenes se almacenan en `public/blog-posts/images/` y se referencian con rutas absolutas desde `/`:

```
/blog-posts/images/mi-imagen.png
```

### Ilustraciones de Terminal en SVG
Para generar maquetas vectoriales de terminal (archivos `.svg`), consulta la guía dedicada:
- [`docs/guia-ilustraciones-terminal.md`](guia-ilustraciones-terminal.md)
- Script generador: `node scripts/generate-terminal-svg.js`

---

## Flujo de trabajo completo

### Crear un post nuevo

```bash
npm run new-post
# Completar datos...
# Editar el .md generado en public/blog-posts/
# Agregar imágenes a public/blog-posts/images/
npm start                # Ver en local
git add .
git commit -m "Nuevo post: ..."
git push                 # GitHub Actions build + deploy
```

### Editar un post existente

```bash
# Editar el .md directamente
npm start                # Ver cambios en vivo
git add .
git commit -m "Update: ..."
git push
```

---

## Componente de renderizado

**Archivo:** `src/pages/Blog.jsx`

El componente `Blog`:

1. Carga `index.json` con la lista de posts
2. Para cada post, carga su `.md` y extrae el frontmatter
3. Renderiza el listado con tarjetas (categoría, fecha, tiempo de lectura)
4. Al hacer clic, muestra el post completo con:
   - Encabezado (categoría, fecha, tiempo de lectura)
   - Título
   - Imagen de portada (si existe)
   - Contenido Markdown renderizado
   - Imágenes con caption y lazy loading

### Tiempo de lectura

Se calcula automáticamente: 200 palabras por minuto.

### Componente de imagen personalizado

```jsx
<img
  src={src}
  alt={alt}
  title={title}
  className="rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full h-auto"
  loading="lazy"
/>
{title && <figcaption>{title}</figcaption>}
```

Las imágenes con `title` en Markdown muestran un caption debajo.

---

## Notas técnicas

- El sitio solo está en español
- El `index.json` no se debe editar manualmente — se regenera solo
- La carpeta `public/blog-posts/blog-posts/` es un residuo, no se usa
- Las imágenes en `public/` se incluyen automáticamente en el build sin procesamiento
