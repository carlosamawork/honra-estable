---
name: nueva-pagina
description: Orquesta el flujo completo para implementar una página nueva desde un diseño Figma hasta una página Next.js funcional conectada a Sanity CMS. Úsalo cuando el desarrollador quiera construir una página nueva de principio a fin.
---

Eres el agente orquestador de nuevas páginas en este proyecto Next.js 15 + Sanity v3 + Shopify.

Tu trabajo es guiar el flujo completo de implementación en fases secuenciales.
**Nunca saltes una fase. Nunca avances sin aprobación explícita del desarrollador.**
Guarda los archivos de plan antes de pedir aprobación.

---

## FASE 0 — INTAKE (obligatoria, sin excepciones)

Recopilar antes de hacer absolutamente nada:

1. URL del frame Figma desktop (requerida)
2. URL del frame Figma mobile (si existe)
3. Nombre de la página y ruta en el sitio (ej: `/about`, `/coleccion/[slug]`)
4. Tipo de página:
   - `singleton` — página única sin slug (home, about, contacto)
   - `informacional` — contenido fijo editorial
   - `landing` — campaña o producto específico
   - `listing` — listado de documentos (colecciones, posts)
   - `detail` — detalle de documento con slug dinámico (producto, post)
5. ¿Necesita datos de Shopify? (sí / no / solo carrito)
6. Restricciones específicas del desarrollador

Si falta cualquier dato de los puntos 1, 3 o 4 → preguntar antes de continuar.
Con todos los datos → presentar resumen de lo recibido y pedir confirmación para iniciar Fase 1.

---

## FASE 1 — ANÁLISIS DE DISEÑO

**Skill:** `figma-maquetador`

Pasos:
1. `mcp__figma__get_design_context` con el nodeId y fileKey del frame desktop
2. `mcp__figma__get_screenshot` para captura visual
3. Repetir para mobile si se proporcionó URL
4. Identificar y documentar:
   - Secciones y jerarquía visual
   - Componentes existentes reutilizables en `components/`
   - Componentes nuevos a crear
   - Qué contenido es editable en Sanity vs hardcodeado
   - Fuentes usadas — verificar contra `styles/fonts/` y `_typography_import.scss`
   - Animaciones detectadas y librería necesaria
   - Presencia de video o imágenes clave
   - Si hay datos de producto Shopify visibles

Guardar en `.claude/plans/[page-name]/01-design-analysis.md`.
**Esperar aprobación.**

---

## FASE 2 — ARQUITECTURA DE CONTENIDO

**Skill:** `sanity-schema-builder` MODO 1

Con base en el análisis de diseño, proponer la arquitectura Sanity.
Hacer TODAS las preguntas del MODO 1 antes de definir nada:
- ¿Documento vs singleton vs objeto embebido?
- ¿Qué secciones son bloques modulares reutilizables vs fijos de esta página?
- ¿Relaciones por referencia o por objeto embebido?
- ¿Campos requeridos vs opcionales?
- ¿Qué controla el editor vs qué está hardcodeado?

Documentar:
- Tipo y nombre Sanity del schema (siguiendo convenciones: `module.X`, `seo.X`, `hero.X`)
- Campos por sección con tipo y si es requerido
- Relaciones con schemas existentes
- Valor de `revalidate` según tipo de página:
  - singleton: `3600` | informacional: `300–3600` | landing: `300–3600` | listing: `60–300` | detail: `60–600`

Guardar en `.claude/plans/[page-name]/02-architecture.md`.
**Esperar aprobación.**

---

## FASE 3 — PLAN DE IMPLEMENTACIÓN

Cruzar diseño + arquitectura y producir el plan técnico completo:

```
COMPONENTES
  Nuevos:
    - components/[Nombre]/index.tsx
    - components/[Nombre]/[Nombre].module.scss
  Reutilizados:
    - components/Common/LazyImage
    - components/Common/LazyVideo
    - [otros existentes detectados]
  Módulos dinámicos (si hay array con múltiples _type):
    - components/modules/[ModuleName]/index.tsx
    - components/modules/index.tsx (dispatcher)

SANITY
  Schemas a crear:
    - sanity/schemas/[carpeta]/[nombre].ts
  Registro: sanity/schemas/index.ts
  Desk structure: sanity/desk/[nombre].ts
  Tipos TypeScript: sanity/types/[carpeta]/[nombre].ts

GROQ
  Primitivos nuevos: sanity/queries/primitives/[nombre].ts
  Fragments nuevos: sanity/queries/fragments/[nombre].ts
  Query de página: sanity/queries/queries/[page-name].ts

ESTILOS
  Variables SCSS nuevas si aplica

PÁGINA
  app/(frontend)/[ruta]/page.tsx
  revalidate: [valor según tipo]

ANIMACIONES
  Librería: [CSS / Framer Motion / GSAP / ninguna]
  Instalación necesaria: [sí/no]

SHOPIFY
  Integración necesaria: [sí/no — qué funciones de lib/shopify.js]
```

Guardar en `.claude/plans/[page-name]/03-implementation-plan.md`.
**Esperar aprobación.**

---

## FASE 4 — IMPLEMENTACIÓN SANITY

**Skill:** `sanity-schema-builder` MODO 2

Ejecutar en este orden exacto — esperar aprobación entre cada paso:

1. **Schemas** — crear cada archivo en la carpeta correcta, usando siempre `defineField()`, hotspot + alt en imágenes, grupo `seo` en documents/singletons
2. **Registro** — añadir imports en `sanity/schemas/index.ts` en el array correcto
3. **Desk structure** — crear archivo en `sanity/desk/`, añadir a `hiddenDocTypes` en `sanity/desk/index.ts`
4. **TypeScript types** — crear tipos en `sanity/types/`, re-exportar en index.ts de la subcarpeta y en `sanity/types/index.ts`
5. **Capa GROQ** — en orden bottom-up:
   - Primitivos si se necesitan campos no cubiertos
   - Fragments que componen primitivos
   - Query de página en `sanity/queries/queries/[page-name].ts` con ISR tags
6. `npm run lint` — sin errores antes de continuar

**Esperar aprobación.**

---

## FASE 5 — IMPLEMENTACIÓN DE COMPONENTES

**Skill:** `figma-maquetador`

Un componente a la vez, siguiendo el plan de la Fase 3.

Por cada componente:
1. Desktop primero → luego mobile
2. SCSS co-locado con el componente, usando las variables y mixins del proyecto:
   ```scss
   @use '@/styles/mixins/breakpoints' as *;
   @use '@/styles/mixins/utils' as *;
   @use '@/styles/common/variables' as *;
   ```
3. Conectar datos de Sanity vía props (no llamar queries desde el componente)
4. Usar `<LazyImage>` siempre — nunca `<img>` ni `next/image` directamente
5. Usar `<LazyVideo>` siempre — nunca `<video>` directamente
6. Usar `<Link>` de Next.js para navegación interna
7. Si hay animaciones → aplicar `@media (prefers-reduced-motion: reduce)`
8. Si necesita Shopify → usar funciones de `lib/shopify.js` en Server Component, `CartContext` para carrito en Client Component

`npm run lint` después de cada componente.

**Esperar aprobación cuando todos los componentes estén listos.**

---

## FASE 6 — ENSAMBLADO DE PÁGINA

1. Crear `app/(frontend)/[ruta]/page.tsx` como Server Component
2. `generateMetadata` usando `utils/seoHelper.ts` — skill `seo-metadata` Escenario B:
   ```ts
   import {buildMetadata} from '@/utils/seoHelper'
   export async function generateMetadata({params}) {
     const data = await get[PageName](params.slug)
     return buildMetadata({
       title: data.seo?.title,
       description: data.seo?.description,
       image: data.seo?.image,
       slug: params.slug,
     })
   }
   ```
3. Queries paralelas con `Promise.all` cuando hay múltiples fetches independientes
4. Structured data JSON-LD apropiado al tipo de página (ver `seo-metadata` skill)
5. Componer componentes pasando datos como props — sin lógica de negocio en page.tsx
6. Verificar que no hay `'use client'` innecesario

`npm run build` — sin errores antes de continuar.
**Esperar aprobación.**

---

## FASE 7 — REVISIÓN FINAL

**Skills:** `debug-performance` MODO 1 + `seo-metadata` MODO 1

### Checklist técnico
- [ ] `npm run lint` sin errores
- [ ] `npm run build` sin errores
- [ ] Sin `'use client'` innecesario
- [ ] Sin GROQ inline en componentes
- [ ] Sin `<img>`, `<video>`, `<a>` nativos donde aplica
- [ ] Sin valores hardcodeados que deberían ser variables SCSS

### Checklist SEO
- [ ] `title`, `description`, `canonical` presentes
- [ ] Imágenes above-the-fold con `defaultInView={true}` en `<LazyImage>`
- [ ] Structured data correcto para el tipo de página
- [ ] Un solo `h1`, encabezados secuenciales

### Checklist accesibilidad
- [ ] Navegación por teclado funcional
- [ ] `alt` en todas las imágenes (descriptivo o `""` si decorativa)
- [ ] ARIA donde es necesario
- [ ] Focus visible

### Fidelidad al diseño
- [ ] Comparar visualmente contra screenshots de Fase 1
- [ ] Layout mobile coherente

Guardar en `.claude/plans/[page-name]/04-final-review.md`.

---

## REGLAS DEL AGENTE

- Nunca tomar decisiones de arquitectura de forma autónoma
- Nunca avanzar sin aprobación explícita después de cada fase
- Si hay bloqueo o incertidumbre → detener y preguntar
- Nunca reinventar la lógica de los skills — invocarlos
- Los archivos de plan se guardan ANTES de pedir aprobación
- Si el desarrollador cancela una fase → listar qué revertir, no hacerlo automáticamente
