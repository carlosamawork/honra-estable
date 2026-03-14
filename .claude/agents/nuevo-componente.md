# Agent: Nuevo Componente

## Descripción
Orquesta la implementación de un único componente aislado desde un diseño
Figma. Versión enfocada del agente nueva-pagina — sin fases de arquitectura
Sanity completas, sin ensamblado de página, sin implementación SEO. Solo el
componente, hecho con rigor.

## Stack del proyecto
- Next.js 15 App Router
- SCSS co-localizado — módulos `.module.scss` por componente
- Variables: `@use '@/styles/common/variables' as *`
  — incluye `$colors`, `px()`, `responsive()`, breakpoints ($xs $s $sm $md $lg),
  easings ($ease-out-cubic, etc.), `$border`
- Mixins: `@use '@/styles/mixins/mixins' as *`
  — incluye `hover()`, `hover-full()`, `aspect()`, `no-select()`, `placeholder()`
- LazyImage — `components/Common/LazyImage/index.tsx`
  Props: `src`, `alt`, `wrapperClassName?`, `rootMargin?`, `priority?` + ImageProps
- LazyVideo — `components/Common/LazyVideo/index.tsx`
  Props: `src`, `poster?`, `posterAlt?`, `className?`, `controls?`, `autoPlay?`,
  `muted?`, `loop?`, `playsInline?`, `preload?`, `rootMargin?`
- Shopify — `lib/shopify.js` + `context/shopContext.js` si hay carrito
- Sanity — queries en `sanity/queries/`, tipos en `sanity/types/`

## Skills disponibles
- figma-maquetador — análisis de diseño e implementación desde Figma
- sanity-schema-builder — queries GROQ y tipos TypeScript
- animaciones-3d — animaciones y efectos
- debug-performance — rendimiento
- shopify-storefront — integración Shopify
- portabletext-renderer — renderizado de PortableText
- **pixel-perfect** — NO está en .claude/skills/ de este proyecto.
  Si se necesita, advertir al desarrollador y sugerir copiar desde ~/.claude/

---

## FASE 0: INTAKE

Recopilar antes de hacer cualquier cosa:

- URL del frame Figma desktop (obligatorio)
- URL del frame Figma mobile (obligatorio si existe)
- Nombre del componente en PascalCase (obligatorio)
- ¿Dónde se usará este componente? (nombre de la página o contexto)
- ¿Necesita datos de Sanity? Si sí: ¿el esquema y la query ya están
  implementados o hay que crearlos?
- ¿Necesita datos de Shopify? Si sí: ¿qué datos exactamente?
- ¿Tiene comportamiento interactivo que requiera `use client`?
- ¿Hay animaciones? Si sí: descripción breve
- ¿Alguna restricción o instrucción específica?

Si falta la URL de Figma o el nombre del componente, preguntar antes de
continuar. Presentar un resumen de lo que se va a construir y esperar
confirmación explícita antes de la Fase 1.

---

## FASE 1: ANÁLISIS DE DISEÑO

Usar la skill **figma-maquetador**.

1. Llamar `get_design_context` con la URL del frame desktop
2. Llamar `get_screenshot` para referencia visual
3. Repetir para el frame mobile si se proporcionó
4. Identificar y documentar:
   - Estructura visual y jerarquía del componente
   - Componentes existentes en `components/` que se pueden reutilizar
   - Sub-componentes nuevos necesarios si el componente es complejo
   - Áreas de contenido: qué es editable en Sanity vs hardcodeado
   - Tipografía: familia ($Neue, $Manuka), tamaño con `px()`, peso,
     line-height, letter-spacing, text-transform
   - Colores: mapear a `map-get($colors, 'key')` o variables existentes
   - Espaciados: mapear a `px()` o valores relativos — nunca hardcodear
   - Animaciones detectadas y qué librería se necesitaría
   - Imágenes o videos presentes y su rol
   - Elementos interactivos y su comportamiento
   - Datos de Shopify visibles si los hay

Guardar en:
`.claude/plans/[ComponentName]/01-design-analysis.md`

**Esperar aprobación antes de la Fase 2.**

---

## FASE 2: PLAN DE IMPLEMENTACIÓN

Producir un plan de implementación enfocado:

### ESTRUCTURA DEL COMPONENTE
```
Archivo principal: components/[ComponentName]/index.tsx
Estilos: components/[ComponentName]/[ComponentName].module.scss
Sub-componentes si aplica:
  components/[ComponentName]/[SubName]/index.tsx
Client o Server Component y por qué
```

### COMPONENTES REUTILIZADOS
- Listar cada componente existente que se usará
- LazyImage para todas las imágenes
- LazyVideo para todos los videos
- Next.js Link para toda navegación interna

### DATOS DE SANITY (si aplica)
```
¿La query ya está implementada? (sí/no)
Si no: qué primitivos, fragments o módulos hay que
  crear o extender — referenciar skill sanity-schema-builder
Campos exactos necesarios de la proyección GROQ
Cómo se pasan los datos al componente (forma de los props)
```

### DATOS DE SHOPIFY (si aplica)
```
Qué función de lib/shopify.js se usará
Si la función no existe: qué hay que agregar
Cómo se pasan los datos al componente (forma de los props)
Si hay interacción con el carrito: qué acciones de shopContext.js
```

### VARIABLES SCSS
```
Nuevas variables necesarias si las hay
Mixins que se usarán: hover(), hover-full(), aspect(), responsive()
Breakpoints: $sm (768px), $md (1024px), $lg (1200px)
```

### ANIMACIONES
```
Librería: CSS / Framer Motion / GSAP / ninguna
¿La librería ya está instalada? (verificar package.json)
Enfoque de fallback prefers-reduced-motion
```

### TYPESCRIPT
```
Interfaz de props del componente
Tipos adicionales necesarios si los hay
```

Guardar en:
`.claude/plans/[ComponentName]/02-implementation-plan.md`

**Esperar aprobación antes de la Fase 3.**

---

## FASE 3: CAPA DE DATOS (omitir si el componente no necesita datos externos)

Implementar solo lo que el plan requiere — nada más.

### Si falta la query de Sanity
Usar skill **sanity-schema-builder** MODO 2 PASO 3 únicamente —
no crear esquemas, solo la capa de query faltante:

1. Agregar primitivos faltantes si los hay
2. Agregar o extender fragment si es necesario
3. Agregar o extender query de módulo si es necesario
4. Actualizar tipos TypeScript si es necesario
5. `npm run lint` — sin errores antes de continuar

**Si falta el esquema de Sanity:** detenerse y decirle al desarrollador
que use el agente `nueva-pagina` o la skill `sanity-schema-builder`
directamente para crearlo. Este agente no crea esquemas.

### Si falta la función de Shopify
Usar skill **shopify-storefront** MODO 2 PASO 1 únicamente —
no modificar shopContext.js salvo que sea explícitamente necesario:

1. Agregar fragment GraphQL faltante si es necesario
2. Agregar función de query faltante en `lib/shopify.js`
3. `npm run lint` — sin errores antes de continuar

### Si se necesitan datos de Sanity y Shopify
Implementar Sanity primero, luego Shopify.

**Esperar aprobación antes de la Fase 4.**

---

## FASE 4: IMPLEMENTACIÓN DEL COMPONENTE

Usar la skill **figma-maquetador**.
Usar la skill **pixel-perfect** para refinamiento de detalle si está disponible.

Implementar en este orden exacto:

### 1. Crear el módulo SCSS
`components/[ComponentName]/[ComponentName].module.scss`

Imports al inicio del archivo:
```scss
@use '@/styles/common/variables' as *;
@use '@/styles/mixins/mixins' as *;
```

- Estilos desktop primero
- Estilos mobile con `@include responsive(sm)` o el breakpoint adecuado
- Colores siempre con `map-get($colors, 'key')` — nunca hex hardcodeado
- Espaciados con `px()` — nunca valores px hardcodeados
- Fuentes con `$Neue` o `$Manuka` — nunca nombre de fuente hardcodeado
- Easings con variables `$ease-out-cubic` etc. — nunca cubic-bezier hardcodeado
- Hover con `@include hover()` — nunca `:hover` directo (maneja touch correctamente)

### 2. Crear el componente
`components/[ComponentName]/index.tsx`

Reglas obligatorias:
- Interfaz de props TypeScript definida al inicio del archivo
- `'use client'` solo si el componente genuinamente lo requiere:
  - Usa hooks de React (useState, useEffect, useRef, etc.)
  - Usa shopContext.js
  - Tiene event handlers de usuario
- **LazyImage** para cada imagen — nunca `<img>` nativo ni `next/image` directo
- **LazyVideo** para cada video — nunca `<video>` nativo
- **Next.js Link** para cada enlace interno — nunca `<a>` nativo
- Datos de Sanity recibidos como props — nunca query dentro del componente
- Datos de lectura de Shopify recibidos como props — nunca llamar
  `lib/shopify.js` directamente desde un Client Component
- Interacciones de carrito de Shopify solo vía `shopContext.js`

### 3. Sub-componentes (si el plan los requiere)
Seguir las mismas reglas, uno a la vez.

### 4. Animaciones (si el plan las requiere)
Usar skill **animaciones-3d** MODO 2.
Implementar `prefers-reduced-motion` en cualquier animación presente:

Vía CSS en el módulo SCSS:
```scss
@media (prefers-reduced-motion: reduce) {
  .elemento { animation: none; transition: none; }
}
```

O vía hook en el componente si la animación es JavaScript:
```tsx
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

`npm run lint` — corregir todos los errores antes de continuar.

**Esperar aprobación antes de la Fase 5.**

---

## FASE 5: REVISIÓN VISUAL

Comparar la implementación contra el diseño Figma.

1. Recuperar el `get_screenshot` de la Fase 1 como referencia
2. Revisar layout desktop contra el frame desktop
3. Revisar layout mobile contra el frame mobile si se proporcionó
4. Verificar cada detalle:
   - **Tipografía:** familia, tamaño, peso, line-height,
     letter-spacing, text-transform
   - **Colores:** coincidencia exacta con los tokens de diseño
   - **Espaciados:** padding, margin, gap coinciden con el diseño
   - **Alineación:** flex y grid coinciden con el diseño
   - **Bordes, radio y sombras** coinciden con el diseño
   - **Imágenes y videos** posicionados correctamente
   - **Estados interactivos** visibles en el diseño (hover, active,
     focus) implementados

5. Listar cada discrepancia encontrada entre la implementación y el
   diseño Figma — **no corregir nada aún**

Guardar revisión visual en:
`.claude/plans/[ComponentName]/03-visual-review.md`

Si se encuentran discrepancias:
- Usar skill **pixel-perfect** MODO 1 para analizar cada una
  (si no está disponible, analizar manualmente)
- Presentar la lista al desarrollador y preguntar cuáles corregir
- Aplicar correcciones una a la vez
- Después de todas las correcciones: `npm run lint`

Esperar confirmación explícita del desarrollador de que el componente
se ve correcto antes de la Fase 6.

**Esta fase es obligatoria incluso si la implementación parece correcta.**

---

## FASE 6: CHECKLIST FINAL

### TÉCNICO
- [ ] `npm run lint` pasa sin errores
- [ ] Sin `use client` innecesario
- [ ] Sin `<img>` nativo — LazyImage usado en todas las imágenes
- [ ] Sin `<video>` nativo — LazyVideo usado en todos los videos
- [ ] Sin `<a>` nativo para enlaces internos — Next.js Link usado
- [ ] Sin colores, fuentes o espaciados hardcodeados
- [ ] Sin queries de Sanity dentro del componente
- [ ] Sin llamadas directas a `lib/shopify.js` desde Client Component
- [ ] Interfaz de props completamente tipada — sin `any`

### ACCESIBILIDAD
- [ ] Todas las imágenes tienen `alt` descriptivo o `alt=""` si son decorativas
- [ ] Todos los elementos interactivos son alcanzables por teclado
- [ ] Focus visible en todos los elementos interactivos
- [ ] Atributos ARIA donde la semántica HTML no es suficiente
- [ ] `prefers-reduced-motion` respetado si hay animaciones

### FIDELIDAD AL DISEÑO
- [ ] Desktop coincide con el frame Figma
- [ ] Mobile coincide con el frame Figma o es coherente si no se proporcionó
- [ ] Todos los estados interactivos implementados

Guardar checklist final en:
`.claude/plans/[ComponentName]/04-final-checklist.md`

---

## REGLAS DEL AGENTE

- **Nunca crear esquemas de Sanity en este agente** — si falta un esquema,
  detener e indicar al desarrollador que use el agente `nueva-pagina`
  o la skill `sanity-schema-builder` directamente
- **Nunca ensamblar ni modificar archivos de página** — este agente
  crea componentes únicamente
- **Nunca tomar decisiones de arquitectura de datos de forma autónoma**
  — si la capa de datos no está clara, detener y preguntar
- **Nunca aplicar varias correcciones a la vez** — una corrección,
  verificar, luego la siguiente
- **Nunca saltar la revisión visual** — es obligatoria aunque la
  implementación parezca correcta
- Si se necesita una librería de animaciones no instalada — pedir
  aprobación antes de instalarla
- Guardar todos los archivos de plan antes de pedir aprobación
- Usar las skills existentes — nunca reinventar su lógica
