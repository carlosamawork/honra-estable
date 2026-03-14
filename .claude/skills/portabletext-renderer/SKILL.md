# SKILL: PortableText Renderer

## MODO 1 — AUDITORÍA

**Activa cuando**: el desarrollador pide revisar renderers existentes o cobertura faltante.

### Preguntas previas
- ¿Es auditoría de todos los renderers o uno específico?
- ¿Hay bloques que no se renderizan o aparecen como texto plano?
- ¿El foco es cobertura, accesibilidad o fidelidad visual?

Nunca aplicar fixes en este modo — solo auditar y reportar.

---

### Áreas de auditoría (en orden)

**COBERTURA**
- Mapear cada tipo de bloque en `sanity/schemas/blocks/` contra renderers en `utils/portableText/`.
- Identificar bloques sin renderer (caen al default → texto plano o nada).
- Identificar annotations sin renderer (`annotationLinkExternal`, `annotationLinkEmail`, `annotationProduct`).
- Verificar `list` y `listItem` definidos (`bullet`, `number`).

**CALIDAD**
- Links externos → `<a href rel="noopener noreferrer">`. Nunca `<Link>` de Next.js para URLs externas.
- Links internos → `<Link>` de Next.js. Nunca `<a>` para rutas internas.
- Mailto → `<a href="mailto:...">`. Nunca `<Link>`.
- Imágenes → `<LazyImage>`. Nunca `<img>` nativo.
- Videos → `<LazyVideo>`. Nunca `<video>` nativo.
- Estilos → CSS variables del proyecto (`var(--margin)`). Sin hardcoded colors/fonts.
- `htmlEmbed` → `dangerouslySetInnerHTML` solo si el contenido viene de un CMS de confianza (Sanity).

**ACCESIBILIDAD**
- Links con texto descriptivo o `aria-label`.
- Imágenes con `alt` del campo Sanity. Decorativas con `alt=""`.
- Marks que transmiten significado no son solo color.

**CONSISTENCIA CON SCHEMA Y GROQ**
- Cada renderer usa solo campos reales del schema.
- La proyección GROQ de `body` incluye todos los campos que los renderers necesitan.
- Verificar en `sanity/queries/fragments/body.ts` antes de añadir fields al renderer.

**Formato del reporte:** `.claude/plans/portabletext/audit-[scope]-[fecha].md`

Esperar aprobación antes del MODO 2.

---

## MODO 2 — IMPLEMENTACIÓN

### Preguntas previas
- ¿Cuál es el diseño visual del bloque?
- ¿Comparte estilos con el renderer padre o necesita los suyos?
- ¿Se usa en múltiples contextos (base) o solo en uno (contextual)?
- ¿Contiene media o comportamiento interactivo?

### Escenario A — Fixes tras auditoría (en orden)
- **GRUPO 1 Crítico**: bloques sin renderer · `<Link>` para URLs externas · `<img>` nativo.
- **GRUPO 2 Alto**: marks sin renderer · renderer leyendo campos no en GROQ.
- **GRUPO 3 Medio**: accesibilidad en links/imágenes · `any` types.
- **GRUPO 4 Bajo**: inconsistencias visuales menores.

### Escenario B — Renderer nuevo (orden exacto)

**PASO 1 — Schema** (si el bloque no existe): usar skill `sanity-schema-builder`. Esperar aprobación.

**PASO 2 — GROQ**: añadir el bloque a `sanity/queries/fragments/body.ts`. Verificar cada campo en el schema.

**PASO 3 — TypeScript interface**:
```ts
// utils/portableText/types.ts
export type HtmlEmbed = {_type: 'htmlEmbed'; html: string}
```

**PASO 4 — Renderer**: añadir al objeto components del renderer correspondiente.

**PASO 5 — Registro**: verificar que el renderer se importa en todos los archivos de `utils/portableText/` que lo necesitan.

**PASO 6**: `npm run lint` + verificación visual con contenido real.

---

## CONVENCIONES DEL PROYECTO

**Estructura de `utils/portableText/`:**
```
utils/portableText/
  portableText.tsx          # Base completo — todos los block types del body schema
  portableTextAbout.tsx     # Contextual — estilos específicos de la página About
  portableTextTerms.tsx     # Contextual — estilos específicos de páginas legales
  portableTextCredits.tsx   # Contextual — acepta options para className dinámico
```

**Dos patrones de export:**
- **Función** `portableBlockComponents(options?)`: para renderers que necesitan config dinámica (className, datos externos).
- **Objeto** `portableBlockComponentsX`: para renderers estáticos sin config.

**Uso en componentes:**
```tsx
import {PortableText} from '@portabletext/react'
import {portableBlockComponents} from '@/utils/portableText/portableText'

<PortableText value={body} components={portableBlockComponents()} />
```

**Renderer base estándar — marks compartidos:**
```tsx
annotationLinkExternal: ({value, children}) => (
  <a href={value?.url} target={value?.newWindow ? '_blank' : '_self'} rel="noopener noreferrer">
    {children}
  </a>
),
annotationLinkEmail: ({value, children}) => (
  <a href={`mailto:${value?.email ?? ''}`}>{children}</a>
),
annotationProduct: ({value, children}) => {
  const slug = value?.productWithVariant?.store?.slug?.current
  return slug ? <Link href={`/products/${slug}`}>{children}</Link> : <>{children}</>
},
```

**GROQ projection en `sanity/queries/fragments/body.ts`:**
Usar condicionales por `_type` para proyectar solo los campos de cada módulo.
Siempre importar `imageData` e `imageSize` para campos de imagen.

---

## BLOCK TYPES DEL SCHEMA body

| Tipo | Renderer en base | Notas |
|------|------------------|-------|
| `normal`, `h1`–`h6`, `blockquote` | ✅ `block.*` | — |
| `em`, `strong` | ✅ `marks.*` | HTML nativo |
| `annotationLinkExternal` | ✅ `marks.annotationLinkExternal` | `<a>` externo |
| `annotationLinkEmail` | ✅ `marks.annotationLinkEmail` | `<a mailto>` |
| `annotationProduct` | ✅ `marks.annotationProduct` | `<Link>` interno |
| `bullet`, `number` | ✅ `list.*` + `listItem.*` | — |
| `module.accordion` | ⚠️ stub `null` | Pendiente componente |
| `module.callout` | ⚠️ stub `null` | Pendiente componente |
| `module.grid` | ⚠️ stub `null` | Pendiente componente |
| `module.images` | ⚠️ stub `null` | Pendiente componente |
| `module.products` | ⚠️ stub `null` | Pendiente componente |
| `htmlEmbed` | ✅ `types.htmlEmbed` | `dangerouslySetInnerHTML` |
