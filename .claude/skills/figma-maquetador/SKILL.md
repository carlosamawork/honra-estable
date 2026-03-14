# SKILL: Maquetador Figma → Next.js + Sanity

## Rol
Implementar diseños de Figma en este template Next.js 15 + Sanity v3, página a página,
siguiendo las convenciones del proyecto, WCAG AAA y SEO. El diseño de Figma es siempre
la fuente de verdad: nunca corregir ni advertir sobre decisiones visuales.

---

## 1. Workflow de implementación (orden estricto)

### Paso 0 — Obtener el diseño y verificar fuentes

```
mcp__figma__get_design_context(fileKey, nodeId)
```

**Antes de cualquier código, auditar las fuentes del diseño:**

1. Extraer todos los `font-family` usados en el frame de Figma
2. Comprobar qué fuentes ya existen:
   - Archivos en `styles/fonts/` (`.woff`, `.woff2`)
   - `@font-face` declarados en `styles/common/_typography_import.scss`
   - Variables en `styles/common/_variables.scss`
3. Si falta alguna fuente — detener y pedir al usuario los archivos antes de continuar:
   ```
   Fuentes detectadas en Figma no encontradas en el proyecto:
     - "NombreFuente" (weights usados: 400, 700)
   Por favor proporciona los archivos .woff y/o .woff2 para continuar.
   ```
4. Una vez recibidos los archivos, crear:

**`styles/fonts/NombreFuente-Regular.woff2`** — copiar el archivo

**`styles/common/_typography_import.scss`** — añadir al final:
```scss
@font-face {
  font-family: "NombreFuente";
  src: url("../fonts/NombreFuente-Regular.woff2") format("woff2"),
       url("../fonts/NombreFuente-Regular.woff") format("woff");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
// Repetir por cada weight/style disponible
```

**`styles/common/_variables.scss`** — añadir la variable:
```scss
$NombreFuente: "NombreFuente", Helvetica, sans-serif;
```

5. Confirmar al usuario los cambios de fuentes antes de continuar con el Paso 1.

---

### Paso 1 — Analizar el proyecto antes de escribir código
- Revisar `components/` para reutilizar antes de crear
- Revisar `sanity/schemas/` — identificar tipos y arrays de objetos de la página
- Revisar `sanity/queries/fragments/` y `primitives/` — catalogar fragmentos GROQ existentes
- Revisar variables SCSS para colores, tipografía y espaciados

### Paso 2 — Plan escrito (esperar aprobación antes de codificar)
Presentar al usuario:
1. Lista de archivos a crear o modificar
2. Componentes nuevos vs reutilizados
3. Para cada array de objetos Sanity con ≥ 2 tipos de `_type` distintos: módulos dinámicos y dispatcher; si el array tiene un solo tipo, render directo sin dispatcher
4. Fragmentos GROQ existentes a reutilizar vs nuevos a crear
5. Responsive: desktop → mobile

### Paso 3 — Implementar

En este orden:
1. Query GROQ (reutilizando fragments existentes)
2. Tipos TypeScript en `sanity/types/`
3. Módulos dinámicos si hay arrays Sanity (ver §2)
4. Componentes — estilos desktop primero, luego mobile

### Paso 4 — Checkpoint por página
Al terminar cada página, **detener y reportar**:
```
Página completada: [NombrePágina]
Archivos creados/modificados:
  - components/NombrePagina/index.tsx
  - ...

¿Continuamos con la siguiente página o deshacemos esta?
```
Si el usuario cancela: listar exactamente qué borrar/revertir. El agente NO lo hace automáticamente.

---

## 2. Módulos dinámicos para arrays de Sanity

Cuando el schema contiene un array de objetos con `_type` diferente, crear:

```
components/
  modules/
    ModuleAccordion/
      index.tsx
      ModuleAccordion.module.scss
    ModuleGrid/
      index.tsx
      ModuleGrid.module.scss
    index.tsx   <- dispatcher
```

**Dispatcher** (`components/modules/index.tsx`):
```tsx
import ModuleAccordion from './ModuleAccordion'
import ModuleGrid from './ModuleGrid'
import type { Module } from '@/sanity/types'

const moduleMap: Record<string, React.ComponentType<any>> = {
  moduleAccordion: ModuleAccordion,
  moduleGrid: ModuleGrid,
}

export default function Modules({ modules }: { modules: Module[] }) {
  return (
    <>
      {modules?.map((module) => {
        const Component = moduleMap[module._type]
        if (!Component) return null
        return <Component key={module._key} data={module} />
      })}
    </>
  )
}
```

Cada módulo recibe `data` tipado con su propio tipo de `@/sanity/types`.

---

## 3. Queries GROQ — reutilizar siempre lo existente

**Antes de escribir cualquier fragmento, verificar los existentes:**
```
primitives/imageData.ts  -> "caption"
primitives/imageSize.ts  -> imageUrl, metadata, filename, ref, hotspot, crop
fragments/image.ts       -> imageData + imageSize (fragmento completo de imagen)
fragments/seo.ts         -> title, description, image{ image }
```

Solo crear fragmento nuevo si el campo no está cubierto por ninguno existente.

```ts
// Reutilizar siempre
import { image } from '@/sanity/queries/fragments/image'
import { seo }   from '@/sanity/queries/fragments/seo'

export async function getMiPagina() {
  return client.fetch(groq`*[_type == "miPagina"][0]{
    foto{ ${image} },
    seo{ ${seo} },
    modules[]{
      _type, _key,
      ...select(
        _type == "moduleAccordion" => { title, items[]{ question, answer } },
        _type == "moduleGrid"      => { items[]{ foto{ ${image} }, caption } }
      )
    }
  }`)
}
```

Capas:
```
primitives/  -> strings GROQ atómicos
fragments/   -> composición de primitives
common/      -> funciones async globales (header, footer, settings)
queries/     -> funciones async por página
```

---

## 4. Convenciones del proyecto

### Estructura
```
components/NombreComponente/
  index.tsx
  NombreComponente.module.scss
```

### Imports SCSS en cada módulo
```scss
@use '@/styles/mixins/breakpoints' as *;
@use '@/styles/mixins/utils' as *;
@use '@/styles/common/variables' as *;
```

### Breakpoints
`xs:0 | sm:576px | md:768px | lg:992px | xl:1200px | xxl:1500px`
```scss
@include media-breakpoint-down(md) { /* mobile */ }
@include media-breakpoint-up(lg)   { /* desktop */ }
```

### Mixins útiles
```scss
font-size("md")            // 20px desktop — keys: xs/sm/md/lg/xl/xxl
font-size("md", mobile)    // 16px móvil
@include hover()           // solo dispositivos con hover real
@include aspect(16, 9)     // aspect-ratio con fallback
@include remove-scrollbar()
```

### Colores base
`$base:#f6f6f6 | $secondary:#1c1c20`

---

## 5. API de componentes Common

### LazyImage — siempre en lugar de `next/image`
```tsx
<LazyImage
  src={image.imageUrl}                          // requerido
  alt="descripción"                             // requerido
  width={image.metadata.dimensions.width}
  height={image.metadata.dimensions.height}
  filename={image.filename}                     // fallback alt + LD+JSON
  blurDataURL={image.ref}                       // _id del asset Sanity (ref del imageSize primitive)
  fill={false}                                  // true requiere contenedor position:relative
  sizes="100vw"                                 // obligatorio si fill=true
  // Ejemplos comunes:
  // "100vw"                              → imagen full-width
  // "(max-width: 768px) 100vw, 50vw"    → 50% del viewport en desktop
  // "(max-width: 768px) 100vw, 33vw"    → grid de 3 columnas en desktop
  objectFit="cover"                             // "cover"|"contain"|"fill"
  aspectRatio="16/9"
  fullWidth={false}
  fullHeight={false}
  defaultInView={false}
  ignoreRichResults={false}                     // true = omite script LD+JSON
/>
```
> Emite `<script type="application/ld+json">` con schema `ImageObject` automáticamente.

### LazyVideo — siempre en lugar de `<video>`
```tsx
<LazyVideo
  src="https://cdn.ejemplo.com/video.mp4"      // MP4 o .m3u8 (HLS)
  autoplay={true}                               // muta el video automáticamente
  muted={true}
  controls={false}
  preload={false}
  fullHeight={false}
  defaultInView={false}
  thumbnail={{
    imageUrl: "https://...",
    alt: "Descripción",
    filename: "poster.jpg",
    metadata: { dimensions: { width: 1920, height: 1080 } }
  }}
/>
```

### ConsentGate
```tsx
<ConsentGate category="analytics">  {/* | "marketing" */}
  <MiComponenteAnalytics />
</ConsentGate>
```

---

## 6. Buenas prácticas por defecto

- `<Link href="...">` de `next/link` para enlaces internos, nunca `<a>`
- `alt` descriptivo siempre. Imagen decorativa: `alt="" aria-hidden="true"`
- Formularios: `<label htmlFor>` explícito + `aria-required="true"` en obligatorios
- Semántica: `<section>`, `<article>`, `<nav>`, `<main>`, encabezados en orden
- `@media (prefers-reduced-motion: reduce)` para animaciones
- `revalidate` según tipo de página: singletons 3600+, landing/info 300–3600, listing 60–300, detail 60–600; mínimo 10 siempre

---

## 7. Mejoras detectadas en el template (no aplicar — solo referencia)

| # | Archivo | Problema |
|---|---------|----------|
| 1 | `components/Common/Lottie/index.tsx` | Todo comentado — dead code |
| 2 | `NewsletterComponent/index.tsx:19` | `errors` nunca se actualiza, validación client-side rota |
| 3 | `NewsletterComponent/index.tsx:56-73` | Inputs sin `<label>` visible — solo `placeholder` |
| 4 | `LazyVideo/index.tsx` | `isHero` declarado en interfaz pero sin efecto |
| 5 | `LazyImage/index.tsx:27` | `reference` tipado como `any`, debería ser `React.Ref<HTMLDivElement>` |
| 6 | `sanity/schema.ts` | `types:[]` vacío — `schemaTypes` de `schemas/index.ts` nunca se conecta |
| 7 | `sanity/queries/index.tsx` + `sanity-client.ts` | Dos clientes Sanity idénticos |
| 8 | `sanity/types/index.ts` | Mayoría de exports comentados — barrel inutilizable |
| 9 | `CookieConsent.tsx:108` | Checkbox `disabled` sin `aria-disabled="true"` |
| 10 | `_typography.scss:52` | `%h3` definido dos veces — el segundo sobreescribe al primero silenciosamente |
