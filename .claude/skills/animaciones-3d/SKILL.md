# SKILL: Animaciones y 3D

## MODO 1 — DEFINICIÓN DE COMPORTAMIENTO

**Activa cuando**: el desarrollador describe una animación o efecto 3D que quiere implementar.

### Reglas
- Nunca elegir el enfoque de implementación de forma autónoma.
- Hacer TODAS las preguntas necesarias antes de escribir código:
  - ¿Qué dispara la animación? (scroll, hover, click, carga de página, cambio de ruta)
  - ¿Hay una URL de referencia, vídeo o prototipo Figma?
  - ¿Debe respetar `prefers-reduced-motion` o es estructural al diseño?
  - ¿Es decorativa o comunica información?
  - ¿Prioridad de dispositivo: desktop, mobile o ambos?
  - ¿Hay restricciones de performance? (impacto en LCP, batería móvil)
  - ¿Interactúa con otras animaciones de la página?

### Recomendación de librería
Nunca elegir la opción más pesada por defecto. Justificar siempre:

| Caso de uso | Librería recomendada |
|-------------|----------------------|
| Hover, fade, slide simple | **CSS puro** (`transition`/`@keyframes`) |
| Marquee/ticker | **react-fast-marquee** (ya instalado) |
| Sliders/carruseles | **Swiper** (ya instalado) |
| Transiciones de ruta, gestos, layout animations | **Framer Motion** (ya instalado) |
| Scroll-driven con timelines complejos | **GSAP + ScrollTrigger** (requiere instalación) |
| Escenas 3D / WebGL | **React Three Fiber + Drei** (requiere instalación) |
| Lottie | No instalado — proponer solo si el diseño lo requiere explícitamente |

- Producir un plan de implementación con: librería elegida, impacto de performance estimado y estrategia de accesibilidad.
- Esperar aprobación explícita del desarrollador antes de pasar al MODO 2.

---

## MODO 2 — IMPLEMENTACIÓN

**Activa cuando**: el enfoque fue aprobado en MODO 1, o el desarrollador provee una especificación completa.

Esperar aprobación entre cada paso mayor.

---

### PASO 1 — Setup

- Verificar `package.json` antes de proponer nuevas dependencias.
- Si se necesita una nueva librería, pedir aprobación antes de instalar.
- Librerías ya instaladas: `framer-motion ^10`, `swiper ^10`, `react-fast-marquee ^1.6`, `react-double-marquee ^1.1`.

**GSAP** (si se aprueba instalar):
```ts
// lib/gsap.ts — registrar plugins AQUÍ, nunca dentro de componentes
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export {gsap, ScrollTrigger}
```

**React Three Fiber** (si se aprueba instalar):
```tsx
// Siempre con next/dynamic y ssr: false
const Scene = dynamic(() => import('@/components/Scene'), {ssr: false})
```

---

### PASO 2 — Implementación

**Convenciones del proyecto:**
- Estructura: `components/NombreComponente/index.tsx` + `NombreComponente.module.scss`
- `'use client'` solo cuando sea estrictamente necesario (estado, refs, eventos del DOM)
- Usar las easings ya definidas en `styles/common/_variables.scss`:
  `$ease-out-expo`, `$ease-in-out-quart`, `$ease-out-back`, etc.
- Nunca usar `transition: all` — especificar siempre la propiedad exacta

**CSS / SCSS:**
```scss
// Correcto
transition: opacity 0.35s $ease-out-expo;
// Incorrecto — evitar
transition: all 0.25s ease;
```

**Framer Motion:**
```tsx
const variants = {
  hidden: {opacity: 0, y: 20},
  visible: {opacity: 1, y: 0, transition: {duration: 0.5, ease: [0.19, 1, 0.22, 1]}},
}
// layoutId para transiciones de ruta compartidas
```

**GSAP:**
```tsx
useEffect(() => {
  const ctx = gsap.context(() => { /* animaciones */ }, containerRef)
  return () => ctx.revert() // cleanup obligatorio
}, [])
```

**React Three Fiber:**
```tsx
<Canvas dpr={[1, 2]}>
// useFrame: usar delta, nunca valores fijos
useFrame((_, delta) => { mesh.current.rotation.y += 0.5 * delta })
// Limpiar geometrías y materiales en return de useEffect
```

---

### PASO 3 — Accesibilidad

Usar el hook `hooks/useReducedMotion.ts` (ya creado en el proyecto):
```ts
import {useReducedMotion} from '@/hooks/useReducedMotion'
const reduced = useReducedMotion()
```

- **Toda animación** debe respetar `prefers-reduced-motion`.
- Si es decorativa → fallback estático sin animación.
- Si comunica información → mantener el cambio de estado, eliminar solo la transición.

```scss
// Añadir siempre al final del bloque de animación
@media (prefers-reduced-motion: reduce) {
  transition: none;
  animation: none;
}
```

---

### PASO 4 — Verificación de performance

- Animar **solo** `transform` y `opacity` — nunca propiedades de layout.
- Medir con Lighthouse antes y después — alertar si el score cae >5 puntos.
- **3D**: comprimir modelos con `gltf-transform`, máximo 2MB por modelo.
- **Mobile**: reducir complejidad y duración un 30%.

---

## PATRONES EXISTENTES EN EL PROYECTO

**CSS transitions (único patrón activo):**
- `LazyImage.module.scss` — fade-in de imágenes: `opacity 0→1` con `transition: opacity 0.35s ease`
- `_base.scss` — hover en links: `transition: opacity 0.25s ease` + `opacity: 0.7`

**Easings disponibles en `styles/common/_variables.scss`:**
- Colección completa de cubic-bezier: `$ease-out-expo`, `$ease-in-out-quart`, `$ease-out-back`, etc.
- Keyframe global: `@keyframes blink`

**Librerías instaladas sin uso activo:**
- `framer-motion ^10`, `swiper ^10`, `react-fast-marquee ^1.6`, `react-double-marquee ^1.1`

**No instalado:** GSAP, React Three Fiber, Lottie.
