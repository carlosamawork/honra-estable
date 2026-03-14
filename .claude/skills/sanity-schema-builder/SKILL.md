# SKILL: Sanity Schema Builder

## MODO 1 — REVISIÓN DE ARQUITECTURA

**Activa cuando**: el desarrollador describe una arquitectura antes de implementar.

### Reglas
- Nunca tomar decisiones de arquitectura de forma autónoma.
- Leer con atención el documento o diagrama proporcionado.
- Hacer TODAS las preguntas necesarias antes de escribir cualquier archivo:
  - ¿Es un documento (independiente, referenciable) o un objeto embebido?
  - ¿Las relaciones son referencias (`reference`) u objetos embebidos?
  - ¿Qué campos son requeridos vs opcionales?
  - ¿Este bloque modular puede aparecer en otras páginas?
  - ¿Qué controla el editor vs qué está hardcodeado?
  - ¿Hay requisitos de ordenación o filtrado en arrays?
- Producir un resumen escrito de la arquitectura entendida.
- Esperar aprobación explícita del desarrollador antes de avanzar al MODO 2.

---

## MODO 2 — IMPLEMENTACIÓN

**Activa cuando**: la arquitectura fue aprobada en MODO 1, o el desarrollador provee
una especificación completa.

Esperar aprobación entre cada paso mayor.

---

### PASO 1 — Schemas

**Naming de tipos:**
- Documentos/Singletons: nombre plano → `page`, `post`, `home`, `settings`
- Módulos de contenido: prefijo `module.` → `module.image`, `module.grid`
- SEO por contexto: prefijo `seo.` → `seo.home`, `seo.page`
- Heroes por contexto: prefijo `hero.` → `hero.home`, `hero.page`
- Objetos globales: sin prefijo → `linkExternal`, `linkInternal`, `footer`, `menu`
- Objetos Shopify: sin prefijo → `shopifyProduct`, `inventory`, `priceRange`

**Estructura de archivos:**
```
sanity/schemas/
  documents/       # Documentos independientes con slug
  singletons/      # Documentos únicos (home, settings)
  objects/
    global/        # Navegación, links, footer
    module/        # Bloques de contenido reutilizables (prefijo module.)
    seo/           # Variantes SEO por tipo de página
    shopify/       # Campos proxy de Shopify (solo lectura)
    hotspot/       # Objetos con hotspots de imagen
    collection/    # Objetos específicos de colecciones
    ordering/      # Listas ordenables
  blocks/          # Portable text (body)
  taxonomies/      # Categorías y tags
  annotations/     # Anotaciones de rich text
```

**Patrón documento:**
```ts
import {defineField} from 'sanity'
const TITLE = 'Nombre'
export default defineField({
  name: 'nombre',
  title: TITLE,
  type: 'document',
  icon: SomeIcon,
  groups: [
    {default: true, name: 'editorial', title: 'Editorial'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required(), group: 'editorial'}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: validateSlug, group: 'editorial'}),
    defineField({name: 'seo', type: 'seo.page', group: 'seo'}),
  ],
  preview: {
    select: {title: 'title', media: 'seo.image'},
    prepare({title, media}) { return {title, media} },
  },
})
```

**Patrón singleton (deck = documentId fijo):**
- Misma estructura que documento pero sin slug.
- En desk: `.editor().documentId('home')` en lugar de `.documentTypeList()`.

**Patrón objeto módulo:**
```ts
export default defineField({
  name: 'module.nombreModulo',
  type: 'object',
  icon: SomeIcon,
  fields: [...],
  preview: {
    select: {...},
    prepare(s) { return {title: s.title, subtitle: 'NombreModulo'} },
  },
})
```

**Campos de imagen — siempre incluir hotspot + crop + alt:**
```ts
defineField({
  name: 'image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({name: 'alt', type: 'string', title: 'Alt text',
      validation: (Rule) => Rule.required()}),
  ],
})
```

**Registro en index:** añadir import en `sanity/schemas/index.ts` en el array correspondiente.
Añadir el tipo a `hiddenDocTypes` en `sanity/desk/index.ts` para evitar duplicados.

---

### PASO 2 — TypeScript Types

**Estructura real:**
```
sanity/types/
  primitives/     # Tipos base: Image, ImageMetadata
  objects/
    global/       # HeaderData, FooterData, Menu, Links, SettingsData
    seo/          # SEO
    module/       # Tipos de módulos específicos
  singletons/     # Tipos para home, settings
  documents/      # Tipos para page, post, product
  index.ts        # Re-exporta todo (barrel)
```

**Patrón de tipo:**
```ts
import {Image} from '../../primitives/image'

export type NombreModulo = {
  _type: 'module.nombreModulo'
  campo: string
  imagen?: Image
}
```

El `index.ts` de cada subcarpeta re-exporta con `export * from './archivo'`.
El `sanity/types/index.ts` principal re-exporta todas las subcarpetas.

---

### PASO 3 — Capa GROQ

**Arquitectura real del proyecto:**
```
sanity/queries/
  index.tsx        # Client Sanity + urlFor helper
  primitives/      # Strings GROQ de nivel campo (template literals exportados)
  fragments/       # Proyecciones de objeto, componen primitives
  queries/         # Queries de página completa, async functions tipadas
  common/          # Queries compartidas: settings, header, footer (con ISR tags)
```

**Primitivo** (sub-campos reutilizables de un mismo objeto):
```ts
// sanity/queries/primitives/imageSize.ts
export const imageSize = `
  "ref": asset->_id,
  "imageUrl": asset->url,
  "hotspot": hotspot,
  "crop": crop,
  "metadata": asset->metadata{ dimensions },
  "filename": asset->originalFilename
`
```

**Fragment** (proyección de objeto que compone primitivos):
```ts
// sanity/queries/fragments/image.ts
import {imageData} from '../primitives/imageData'
import {imageSize} from '../primitives/imageSize'
export const image = `${imageData}, ${imageSize}`
```

**Query de página** (función async tipada con `groq` tag):
```ts
// sanity/queries/queries/pageName.ts
import {groq} from 'next-sanity'
import {client} from '../index'
import type {PageType} from '@/sanity/types'
import {seo} from '../fragments/seo'

export async function getPage(slug: string): Promise<PageType> {
  return client.fetch(
    groq`*[_type == "page" && slug.current == $slug][0]{
      title,
      seo{ ${seo} }
    }`,
    {slug}
  )
}
```

**Query común** (usa ISR tags de Next.js):
```ts
return client.fetch(groq`...`, {}, {next: {tags: ['settings'], revalidate: 60}})
```

**Regla absoluta**: nunca escribir GROQ inline en componentes de página.
Siempre importar desde `sanity/queries/`.

---

### PASO 4 — Desk Structure

- **Nunca modificar** `app/(admin)/` directamente.
- Cada tipo tiene su propio archivo en `sanity/desk/`.
- Usar `defineStructure` de `sanity/utils/defineStructure.ts`.

**Documento estándar:**
```ts
import defineStructure from '../utils/defineStructure'
export default defineStructure((S) =>
  S.listItem().title('Nombre').icon(Icon)
    .schemaType('typeName').child(S.documentTypeList('typeName'))
)
```

**Singleton (documento único):**
```ts
export default defineStructure((S) =>
  S.listItem().title('Home').schemaType('home')
    .child(S.editor().title('Home').schemaType('home').documentId('home'))
)
```

Importar el structure en `sanity/desk/index.ts` y añadir el `_type` a `hiddenDocTypes`.

---

## PATRONES COMUNES REUTILIZABLES

- **SEO** → usar `type: 'seo.page'` o `type: 'seo.home'` (no crear inline).
- **Imagen** → siempre `type: 'image'`, `options: {hotspot: true}`, campo `alt` requerido.
- **Link externo** → `type: 'linkExternal'` (title, url, newWindow).
- **Link interno** → `type: 'linkInternal'` (title + reference a documento).
- **CTA** → array con `of: [{type: 'linkExternal'}, {type: 'linkInternal'}]`.
- **Page builder modular** → campo `modulos` de tipo `array` con `of: [{type: 'module.X'}, ...]`.
- **Grupos de campos** → siempre declarar `groups` con `editorial` (default) y `seo`.
- **Variante de módulo** → campo `variant` con `layout: 'radio'` + `hidden: ({parent}) => ...`.
- **Usar siempre `defineField()`** — no mezclar con objetos planos `{name, type, ...}`.
