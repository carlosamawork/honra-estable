# SKILL: Debug y Performance

## MODO 1 — AUDITORÍA

**Activa cuando**: el desarrollador pide analizar performance de una página, componente o el proyecto entero.

### Preguntas previas
- ¿Es auditoría de página específica, componente o proyecto completo?
- ¿Hay un reporte Lighthouse o datos de Web Vitals disponibles?
- ¿Qué métricas son prioritarias? (LCP, CLS, INP, bundle size)
- ¿Es un problema en producción o revisión pre-lanzamiento?
- ¿Hay páginas lentas conocidas o quejas de usuarios?

Nunca aplicar fixes en este modo — solo auditar y reportar.

---

### Áreas de auditoría (en orden)

**RENDERIZADO**
- Listar todos los `'use client'` y verificar que cada uno lo justifica (estado, refs, hooks, APIs del browser).
- Detectar Server Components que importan librerías client-only innecesariamente.
- Verificar que los archivos `page.tsx` son Server Components.
- Identificar componentes que podrían dividirse en wrapper Server + island Client.

**DATA FETCHING**
- Detectar proyecciones GROQ que traen más campos de los que el componente usa.
- Detectar fetches duplicados del mismo dato en distintos niveles de componentes.
- Verificar que queries independientes usan `Promise.all` y no se ejecutan en cascada.
- Verificar que cada query tiene estrategia de revalidación correcta (ISR tag, `revalidate`, o ninguna justificada).
- En Shopify: verificar que las queries GraphQL no over-fetchean variantes, imágenes o metafields no usados.

**MEDIA**
- Detectar `<img>` nativos — deben ser `<LazyImage>`.
- Detectar `<video>` nativos — deben ser `<LazyVideo>`.
- Verificar que imágenes above-the-fold usan `priority={true}` en `<LazyImage>`.
- Verificar que imágenes below-the-fold NO usan `priority={true}`.
- Verificar que imágenes con `fill={true}` tienen `sizes` definido.
- Verificar que imágenes sin `width`/`height` no causan CLS.

**BUNDLE**
- Detectar librerías instaladas que no se usan en ningún componente.
- Detectar imports de librerías pesadas en Server Components que solo deberían correr en cliente.
- Detectar componentes pesados below-the-fold sin `next/dynamic`.
- Verificar que librerías de animación no se cargan en páginas que no las usan.

**ESTILOS**
- Detectar estilos de componente en `/styles/` en lugar de co-locados con el componente.
- Detectar valores hardcodeados que deberían usar variables SCSS de `styles/common/_variables.scss`.
- Detectar animaciones CSS sobre propiedades de layout (`width`, `top`, `margin`) en lugar de `transform`/`opacity`.
- Detectar `transition: all` (fuerza recalculation en cada hover).

**Formato del reporte:**
Guardar en `.claude/plans/performance/audit-[scope]-[fecha].md`.
Por cada issue: ubicación (archivo + línea), descripción, impacto (`critical / high / medium / low`), fix recomendado.

Esperar aprobación del desarrollador antes del MODO 2.

---

## MODO 2 — FIX

**Activa cuando**: la auditoría fue aprobada, o el desarrollador señala un issue concreto.

Aplicar en este orden de prioridad. Esperar aprobación entre cada grupo.

**GRUPO 1 — Crítico** (afecta Core Web Vitals directamente)
- `priority={true}` faltante en `<LazyImage>` above-the-fold → LCP
- Imágenes sin dimensiones causando layout shift → CLS
- Imports síncronos pesados bloqueando el main thread
- Server Components convertidos a Client innecesariamente

**GRUPO 2 — Alto** (impacto significativo pero no inmediato en CWV)
- GROQ queries over-fetching campos no usados
- Fetches duplicados en múltiples niveles de componentes
- Librerías instaladas sin uso activo → eliminar con `npm uninstall`
- `<img>` / `<video>` nativos reemplazados por `LazyImage` / `LazyVideo`

**GRUPO 3 — Medio** (calidad de código y performance futura)
- `'use client'` que podrían ser Server Components
- Componentes pesados below-the-fold sin `next/dynamic`
- Animaciones CSS en propiedades de layout

**GRUPO 4 — Bajo** (mantenibilidad)
- Valores hardcodeados que deberían usar variables SCSS
- Estilos de componente en `/styles/` en lugar de co-locados
- Configuración deprecada en `next.config.js`

Después de cada grupo: `npm run build` + `npm run lint`. Documentar cambios en el reporte.

---

## PATRONES CORRECTOS DEL PROYECTO

**Server vs Client Components:**
- `page.tsx` → siempre Server Component. Importa datos con `async/await` directamente.
- `layout.tsx` → Server Component que puede envolver Client Components.
- Client necesarios: `ShopProvider`, `CookieConsent`, `ConsentGate`, `LazyImage`, `LazyVideo` (todos usan estado o browser APIs).
- Regla: si no tiene `useState`, `useEffect`, `useRef` ni event handlers → Server Component.

**Data fetching con queries paralelas:**
```ts
// page.tsx — patrón correcto
export default async function Page() {
  const [pageData, settings] = await Promise.all([
    getPage('about'),
    getSettings(),
  ])
  return <PageComponent data={pageData} settings={settings} />
}
```

**Revalidación:**
```ts
// ISR con tag (patrón del proyecto — ver settings.ts)
client.fetch(groq`...`, {}, {next: {tags: ['pageName'], revalidate: 60}})

// A nivel de página
export const revalidate = 3600
```

**GROQ proyección lean:**
```groq
// Solo traer campos usados por el componente
*[_type == "product"][0]{
  title,
  "slug": slug.current,
  "imageUrl": image.asset->url,
}
// NO: *[_type == "product"][0]  ← trae todo el documento
```

**Shopify — evitar over-fetching:**
- Especificar siempre los campos exactos en `lib/shopify.js`.
- No añadir fields de variantes si la página solo muestra precio base.
- `context/shopContext.js` usa `localStorage` para persistencia de carrito — patrón cliente, no SSR.
