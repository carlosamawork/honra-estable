# SKILL: SEO y Metadata

## MODO 1 — AUDITORÍA

**Activa cuando**: el desarrollador pide revisar SEO de una página, sección o el proyecto completo.

### Preguntas previas
- ¿Es auditoría de página específica, proyecto completo o página nueva?
- ¿Hay keyword objetivo o search intent para esta página?
- ¿Hay datos de Google Search Console o crawl disponibles?
- ¿Hay problemas conocidos de indexación o ranking?
- ¿Es pre-lanzamiento o sitio live?

Nunca aplicar fixes en este modo — solo auditar y reportar.

---

### Áreas de auditoría (en orden)

**METADATA**
- Verificar que cada `page.tsx` usa `generateMetadata` importando desde `utils/seoHelper.ts` — nunca hardcodeado.
- Verificar título ≤60 chars, único por página.
- Verificar descripción entre 120–155 chars, única por página.
- Verificar canonical absoluta y correcta.
- Verificar que páginas dinámicas (product, collection, legal) generan metadata desde Sanity.

**OPEN GRAPH**
- Verificar `og:title`, `og:description`, `og:image` en cada página.
- Verificar que `og:image` viene de Sanity CDN vía `seoHelper.ts` (mínimo 1200×630px recomendado).
- Verificar `og:type` apropiado por tipo de página.

**STRUCTURED DATA**
- Product pages → `Product` schema. Collection/listing → `ItemList`. Corporativo → `Organization`. Legal → `WebPage`.
- Validar que JSON-LD usa datos reales de Sanity/Shopify, no placeholders.

**JERARQUÍA DE ENCABEZADOS**
- Un solo `h1` por página, en Server Component (visible en HTML fuente).
- Niveles secuenciales sin saltos. `h1` contiene la keyword primaria.

**SEO TÉCNICO**
- Imágenes above-the-fold usan `priority={true}` en `<LazyImage>` (impacto en LCP).
- Todos los `<LazyImage>` tienen `alt` significativo, o `alt=""` si son decorativas.
- Fuentes via `next/font` — no `<link>` en `<head>`.
- Verificar `robots.txt` y `sitemap.ts` en el proyecto.
- Links internos usan `<Link>` de Next.js.

**SANITY**
- Verificar que todos los document types tienen campos SEO (title, description, image) tipo `seo.page`.
- Verificar que el fragment GROQ `seo` está en la proyección de cada query de página.
- Verificar que `alt` en imágenes OG es editable en el schema.

**Formato del reporte:** `.claude/plans/seo/audit-[scope]-[fecha].md`

Esperar aprobación antes del MODO 2.

---

## MODO 2 — IMPLEMENTACIÓN

### Escenario A — Fixes tras auditoría (en orden de prioridad)
- **GRUPO 1 Crítico**: páginas sin title/description/canonical · h1 ausente o múltiple · product/collection sin structured data.
- **GRUPO 2 Alto**: Open Graph incompleto · og:image no via seoHelper · campos SEO ausentes en schemas o queries GROQ.
- **GRUPO 3 Medio**: alt faltante en imágenes informativas · jerarquía de headings incorrecta · `priority={true}` faltante above-the-fold.
- **GRUPO 4 Bajo**: longitudes menores · Twitter Cards · canonical relativa.

### Escenario B — SEO de página nueva (orden exacto)
1. Verificar que el schema Sanity tiene `seo.page` — añadir si falta.
2. Verificar que la query GROQ incluye el fragment `seo` en la proyección.
3. Implementar `generateMetadata` en `page.tsx` usando `utils/seoHelper.ts`.
4. Añadir JSON-LD apropiado al tipo de página.
5. Verificar jerarquía de headings en componentes implementados.
6. Verificar `alt` en todos los `<LazyImage>` de la página.

Después de cada grupo: `npm run build` + `npm run lint`.

---

## API DE utils/seoHelper.ts

```ts
import {buildMetadata, buildDefaultMetadata} from '@/utils/seoHelper'

// En page.tsx dinámico
export async function generateMetadata({params}): Promise<Metadata> {
  const data = await getPage(params.slug)
  return buildMetadata({
    title: data.seo?.title,
    description: data.seo?.description,
    image: data.seo?.image,
    slug: params.slug,
    type: 'website', // 'article' | 'product' | 'website'
  })
}

// En layout.tsx (default para todo el sitio)
export const metadata = await buildDefaultMetadata()
// buildDefaultMetadata() usa getDefaultSEO() → settings.seo de Sanity
```

`BASE_URL` se toma de `NEXT_PUBLIC_SITE_URL` en `.env.local`.
**⚠️ Actualizar `NEXT_PUBLIC_SITE_URL` antes de deploy — la canonical y og:url dependen de este valor.**

---

## PATRONES DE STRUCTURED DATA

Insertar como Server Component al final de `page.tsx`:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
/>
```

**WebPage** (informacional/landing): `@type: 'WebPage'`, `name`, `description`, `url`.
**Product** (con Shopify): `@type: 'Product'`, `name`, `image`, `offers: {price, priceCurrency, availability}`.
**ItemList** (collection): `@type: 'ItemList'`, `itemListElement: [{@type: 'ListItem', position, url}]`.
**Organization**: `@type: 'Organization'`, `name`, `url`, `logo`, `sameAs: [redes sociales]`.

`<LazyImage>` no genera `ImageObject` automáticamente — añadirlo solo en schemas donde aporte valor SEO.

---

## PATRÓN SEO EN SCHEMAS SANITY

```ts
// En todo document type — grupo 'seo'
defineField({name: 'seo', title: 'SEO', type: 'seo.page', group: 'seo'})
```

Tipos disponibles: `seo.page` (páginas), `seo.home` (singleton home), `seo` (settings global).
Todos tienen: `title` (string, max 50), `description` (type: seo.description), `image` (image con hotspot + alt).

Fragment GROQ estándar (`sanity/queries/fragments/seo.ts`):
```groq
title, description, image{ "caption": caption, "ref": asset->_id, "imageUrl": asset->url,
  "hotspot": hotspot, "crop": crop, "metadata": asset->metadata{ dimensions }, "filename": asset->originalFilename }
```

---

## ISSUES RESUELTOS (aplicados durante generación del skill)

| # | Fix aplicado |
|---|-------------|
| 1 | `utils/seoHelper.ts` creado |
| 2 | `public/robots.txt` creado |
| 3 | `app/(frontend)/sitemap.ts` creado |
| 4 | `seo.home` y `seo.page` — campo `image` con `hotspot: true` y campo `alt` |
| 5 | `layout.tsx` — `metadata` conectado a `buildDefaultMetadata()` |
| 6 | `.env.example` — añadida variable `NEXT_PUBLIC_SITE_URL` |
