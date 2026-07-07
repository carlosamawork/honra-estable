# SKILL: Diseño Responsivo — Desktop → iPad → Mobile

## Rol
Adaptar layouts desktop a breakpoints iPad (`md: 768px`) y mobile (`sm: 576px`) siguiendo
las convenciones SCSS del proyecto. El diseño desktop es siempre la fuente de verdad.
Nunca alterar la estructura de componentes ni el comportamiento funcional — solo CSS.

---

## Breakpoints del proyecto

```
xs:  0px       → mobile pequeño
sm:  576px     → mobile grande
md:  768px     → tablet / iPad
lg:  992px     → desktop pequeño
xl:  1200px    → desktop
xxl: 1500px    → desktop grande
```

```scss
@include media-breakpoint-down(md)  { /* < 768px  — mobile + tablet */ }
@include media-breakpoint-down(sm)  { /* < 576px  — solo mobile     */ }
@include media-breakpoint-up(lg)    { /* ≥ 992px  — desktop         */ }
@include media-breakpoint-between(sm, lg) { /* 576px–992px — tablet */ }
```

**Regla de uso:**
- `media-breakpoint-down(md)` → cambios que afectan mobile Y tablet
- `media-breakpoint-down(sm)` → cambios solo para móviles pequeños
- Nunca usar valores `px` directos en media queries — siempre los mixins

---

## Escala tipográfica

| Clave | Desktop | Mobile |
|-------|---------|--------|
| xs    | 14px    | 10px   |
| sm    | 16px    | 14px   |
| md    | 20px    | 16px   |
| lg    | 25px    | 18px   |
| xl    | 35px    | 20px   |
| xxl   | 75px    | 35px   |

```scss
// Siempre dos declaraciones: desktop + mobile
font-size: font-size('lg');
@include media-breakpoint-down(md) {
  font-size: font-size('lg', mobile);
}
```

---

## Variables de espaciado

```scss
$offset_m: 2rem;   // padding lateral mobile = 20px
$offset_d: 2rem;   // padding lateral desktop = 20px
$gutter_m: 1rem;   // gutter mobile = 10px
$gutter_d: 1rem;   // gutter desktop = 10px
```

---

## 1. Workflow (orden estricto)

### Paso 1 — Inventario

Antes de tocar CSS, listar:
1. Todos los componentes/secciones con layout a adaptar
2. Por cada uno: identificar el patrón de layout desktop (grid, flex, position)
3. Clasificar cada uno según la tabla de patrones (§2)
4. Estimar el impacto: ¿hay imágenes `fill={true}` sin altura explícita? ¿textos con tamaño fijo? ¿posicionamiento absoluto?

### Paso 2 — Plan escrito

Presentar al usuario **antes de codificar**:

```
Componente: [NombreComponente]
  Patrón desktop: grid 3 columnas
  Adaptación tablet (md): grid 2 columnas
  Adaptación mobile (sm): 1 columna apilada
  Archivos a modificar: components/NombreComponente/NombreComponente.module.scss

Componente: [OtroComponente]
  ...
```

### Paso 3 — Implementar

- Un componente a la vez
- Verificar en el navegador antes de pasar al siguiente
- Usar siempre las variables y mixins del proyecto — nunca valores arbitrarios

### Paso 4 — Checkpoint

```
Componentes adaptados: [lista]
Breakpoints cubiertos: md (768px) / sm (576px)
¿Continuamos con el siguiente o revisamos este?
```

---

## 2. Patrones de adaptación

### Grid N columnas → reducir columnas

```scss
// Desktop: 3 cols
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $gutter_d;

  @include media-breakpoint-down(md) {
    grid-template-columns: repeat(2, 1fr);
    gap: $gutter_m;
  }

  @include media-breakpoint-down(sm) {
    grid-template-columns: 1fr;
  }
}
```

### Flex row → columna apilada

```scss
.row {
  display: flex;
  gap: $gutter_d;

  @include media-breakpoint-down(md) {
    flex-direction: column;
    gap: $gutter_m;
  }
}
```

### Layout dos columnas (contenido + sidebar)

```scss
.layout {
  display: grid;
  grid-template-columns: 1fr 37rem; // contenido + sidebar fijo

  @include media-breakpoint-down(md) {
    grid-template-columns: 1fr;     // apilado
  }
}
```

### Sidebar/drawer (panel lateral)

```scss
.panel {
  position: fixed;
  width: 37rem;

  @include media-breakpoint-down(md) {
    width: 100vw; // ocupa todo el ancho en mobile
  }
}
```

### Imagen con fill={true} y altura implícita

```scss
// El contenedor necesita altura explícita en mobile
.imageWrapper {
  position: relative;
  aspect-ratio: 16 / 9; // desktop

  @include media-breakpoint-down(md) {
    aspect-ratio: 4 / 3; // más cuadrado en mobile
  }

  @include media-breakpoint-down(sm) {
    aspect-ratio: 3 / 4; // portrait en mobile pequeño
  }
}
```

### Hero pantalla completa → aspect-ratio en mobile

```scss
.hero {
  height: 100vh;

  @include media-breakpoint-down(md) {
    height: auto;
    aspect-ratio: 3 / 4;
  }
}
```

### Posicionamiento absoluto → relativo en mobile

```scss
.element {
  position: absolute;
  bottom: 3.2rem;
  left: $offset_d;

  @include media-breakpoint-down(md) {
    position: relative; // o static
    bottom: auto;
    left: auto;
    padding: 1.6rem $offset_m;
  }
}
```

### Texto con tamaño fijo → escalar

```scss
.title {
  font-size: font-size('xl');   // 35px desktop
  line-height: 1.1;

  @include media-breakpoint-down(md) {
    font-size: font-size('xl', mobile);  // 20px mobile
    line-height: 1.2;
  }
}
```

### Módulo de CSS custom property para columnas variables

```scss
// El componente usa --columns como variable CSS (ej. módulos de AbouPage, ExplorePage)
.module {
  display: grid;
  grid-template-columns: repeat(var(--columns, 1), minmax(0, 1fr));

  // En mobile, siempre 1 columna independientemente del valor de --columns
  @include media-breakpoint-down(md) {
    grid-template-columns: 1fr;
  }
}
```

---

## 3. Reglas de touch y accesibilidad mobile

- **Touch targets mínimo 44×44px** — botones, links, controles interactivos
- Usar `padding` para ampliar área clickable sin cambiar tamaño visual:

```scss
.button {
  padding: 0.8rem 1.2rem;

  @include media-breakpoint-down(md) {
    min-height: 4.4rem;
    min-width: 4.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

- `@include hover()` del proyecto ya solo aplica en dispositivos con cursor real (`@media (hover: hover)`) → los estilos hover no se activan en touch
- Para animaciones: siempre añadir `@media (prefers-reduced-motion: reduce)` si hay transiciones

---

## 4. Overflow y scroll

```scss
// Texto que puede desbordar en mobile
.text {
  @include media-breakpoint-down(md) {
    overflow-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
  }
}

// Scroll horizontal en grids de items (carrusel mobile)
.scrollRow {
  @include media-breakpoint-down(md) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    @include remove-scrollbar();

    > * {
      flex-shrink: 0;
      scroll-snap-align: start;
      width: 80vw;
    }
  }
}
```

---

## 5. Patrones específicos del proyecto

### Header fijo — scroll-margin-top en anchors

```scss
// Todo elemento con id usado como anchor debe compensar el header
[id] {
  scroll-margin-top: 6rem; // mobile

  @include media-breakpoint-up(md) {
    scroll-margin-top: 10rem; // desktop
  }
}
```

### LazyImage con sizes responsivo

```tsx
// Siempre adaptar el atributo sizes al layout real en cada breakpoint
<LazyImage
  fill={true}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  // 1 col mobile → 2 cols tablet → 3 cols desktop
/>
```

### Módulos con altura variable (`isFull`, `isMedium`, `isAuto`)

```scss
.isFull .imageWrapper {
  height: 100svh;                         // desktop

  @include media-breakpoint-down(md) {
    height: auto;
    aspect-ratio: 3 / 4;                  // portrait en mobile
  }
}

.isMedium .imageWrapper {
  aspect-ratio: 2 / 3;                    // desktop

  @include media-breakpoint-down(md) {
    aspect-ratio: 4 / 3;                  // más ancho en mobile
  }
}
```

### Spaciado de secciones

```scss
.section {
  padding: 8rem $offset_d;

  @include media-breakpoint-down(md) {
    padding: 4rem $offset_m;
  }
}
```

---

## 6. Checklist antes de entregar

- [ ] ¿Todos los textos tienen `font-size` desktop y mobile?
- [ ] ¿Ningún elemento tiene `overflow: hidden` que corte contenido en mobile?
- [ ] ¿Las imágenes con `fill={true}` tienen contenedor con altura en todos los breakpoints?
- [ ] ¿Los botones tienen mínimo 44px de área táctil?
- [ ] ¿Los grids se apilan correctamente en 1 columna en mobile?
- [ ] ¿Hay elementos con `position: absolute` que puedan desaparecer fuera del viewport?
- [ ] ¿El `LazyImage` tiene `sizes` actualizado al nuevo layout?
- [ ] ¿Los paddings laterales usan `$offset_m` en mobile?
- [ ] ¿Se ha probado en 375px (iPhone SE) y en 768px (iPad)?
- [ ] ¿`@include hover()` en lugar de `:hover` directo para que no se active en touch?

---

## 7. Prohibido

- Usar `!important` para sobrescribir estilos responsive
- Hardcodear valores de breakpoints en `px` en lugar de los mixins
- Cambiar estructura de componentes o props para resolver un problema de layout
- Ocultar elementos con `display: none` en mobile sin ofrecer alternativa accesible
- Usar `vw` para tipografía sin `clamp()` o fallback fijo
- Modificar más de un componente a la vez sin checkpoint del usuario
