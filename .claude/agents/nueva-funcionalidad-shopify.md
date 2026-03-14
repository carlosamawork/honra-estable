# Agent: Nueva Funcionalidad Shopify

## Descripción
Orquesta el flujo completo para implementar una nueva funcionalidad
de ecommerce solicitada por el cliente, desde la descripción hasta una
implementación funcional conectada a Shopify Storefront API y Sanity CMS
cuando sea necesario.

## Stack del proyecto
- Next.js 15 App Router — app/(frontend)/ rutas públicas
- Shopify Storefront API — GraphQL vía graphql-request en lib/shopify.js
- Sanity CMS — esquemas en sanity/schemas/, queries en sanity/queries/,
  tipos en sanity/types/
- Estado del carrito — context/shopContext.js con localStorage (cart_v2)
- Estilos — SCSS co-localizado + variables en styles/common/_variables.scss
- Componentes compartidos — components/Common/ (LazyImage, LazyVideo)

## Habilidades disponibles
- shopify-storefront — integración con Storefront API
- sanity-schema-builder — esquemas GROQ y tipos TypeScript
- figma-maquetador — implementación desde referencia Figma
- debug-performance — revisión de rendimiento
- seo-metadata — metadata y structured data

---

## FASE 0: INTAKE

Antes de hacer cualquier cosa recopilar:

1. Descripción de la funcionalidad en las propias palabras del cliente
2. URLs de referencia, ejemplos de competidores o frames de Figma si existen
3. Páginas o componentes afectados
4. ¿Requiere datos persistentes del usuario? (wishlist, vistos recientemente)
5. ¿Requiere contenido de Sanity CMS junto a datos de Shopify?
6. ¿Hay algún plazo o restricción técnica mencionada por el cliente?
7. ¿Reemplaza funcionalidad existente o agrega algo nuevo?

Si la descripción es ambigua, pedir aclaración antes de continuar.
Nunca interpretar solicitudes vagas de forma autónoma.

Presentar un resumen en lenguaje llano de lo que se va a construir
y esperar confirmación explícita antes de la Fase 1.

---

## FASE 1: ANÁLISIS DE LA STOREFRONT API

Usar la skill **shopify-storefront** en MODO 1.

Analizar qué ofrece la Shopify Storefront API para esta funcionalidad:

### Objetos de API involucrados
Identificar cuáles de los siguientes aplican:
- Cart (cartCreate, cartLinesAdd, cartLinesUpdate, cartLinesRemove)
- Product / ProductVariant (metafields, inventory, pricing)
- Collection (filters, sort, pagination)
- Customer (access token, metafields para persistencia)
- Search / Predictive Search

### Queries y fragments existentes en lib/shopify.js
Revisar:
- CART_LINES_FRAGMENT — estructura de carrito existente
- cartCreate, cartLinesAdd, cartLinesUpdate, cartLinesRemove
- login, getUser, resetPassword
- Identificar qué se puede reutilizar vs qué hay que crear

### Limitaciones conocidas por funcionalidad
Documentar restricciones relevantes:

**Wishlist:** No hay API nativa. Opciones:
  - localStorage (sin auth, sin sync entre dispositivos)
  - Customer metafields (requiere auth con next-auth)
  - Metaobjects de Shopify (requiere config en admin)

**Filtros de colección:** Requieren estructura de query específica
  y configuración en Shopify admin (filtros habilitados por categoría)

**Productos bundle:** Requiere tipo de producto específico en Shopify
  o uso de selling plans / subscription API

**Comparador de productos:** Puramente frontend, no requiere API específica

**Búsqueda predictiva:** Requiere query predictiveSearch separada
  de la búsqueda estándar

**Recomendaciones de producto:** Requiere query productRecommendations

### Configuración de tienda requerida
Si la funcionalidad requiere configuración en Shopify Admin,
DETENER y comunicar exactamente qué debe hacerse antes de continuar.

### Queries y mutations GraphQL exactos necesarios
Documentar las queries completas con variables y tipos de respuesta.

Guardar análisis en:
`.claude/plans/shopify-[feature]/01-api-analysis.md`

**Esperar aprobación antes de la Fase 2.**

---

## FASE 2: DEFINICIÓN DE ARQUITECTURA

### ARQUITECTURA FRONTEND
- Nuevos componentes necesarios con rutas de carpeta
- Componentes existentes a extender o modificar
- Decisión Client vs Server Component por componente:
  - Server Component: fetching de datos de Shopify o Sanity
  - Client Component: interacciones de carrito, estado local, eventos UI
- Estrategia de estado:
  - Extender shopContext.js si está relacionado con carrito
  - localStorage si se necesita persistencia sin auth
  - Customer metafields de Shopify si hay auth disponible (next-auth)

### ARQUITECTURA SANITY (solo si se necesita contenido CMS)
Usar la skill **sanity-schema-builder** en MODO 1.

- Qué contenido vive en Sanity vs en Shopify
- Cómo se conectan los datos de Sanity y Shopify:
  - Products en Sanity tienen _id que corresponde a gid de Shopify
  - ProductVariants en Sanity tienen variantGid de Shopify
  - Collections en Sanity tienen slug que corresponde a handle de Shopify
- Hacer todas las preguntas aclaratorias del MODO 1 antes de definir esquemas

### ARQUITECTURA DE INTEGRACIÓN SHOPIFY
- Nuevas funciones necesarias en lib/shopify.js
- Nuevos fragments GraphQL
- Nuevas queries siguiendo el patrón: `shopifyData(QUERY, { variables })`
- Nuevas mutations si la funcionalidad involucra carrito o datos de cliente
- Estrategia de manejo de errores para cada mutation

Guardar arquitectura en:
`.claude/plans/shopify-[feature]/02-architecture.md`

**Esperar aprobación antes de la Fase 3.**

---

## FASE 3: PLAN DE IMPLEMENTACIÓN

Producir el checklist completo de implementación:

### SHOPIFY (lib/shopify.js)
```
Nuevos fragments:
- FRAGMENT_NAME — descripción

Nuevas queries:
- functionName(params) — descripción

Nuevas mutations:
- functionName(params) — descripción

Configuración de tienda necesaria:
- [lista o "ninguna"]
```

### CONTEXTO / ESTADO
```
Extender shopContext.js: [sí/no — qué se agrega]
Nuevo hook: [ruta si se necesita, ej. hooks/useWishlist.tsx]
Persistencia: [localStorage / metafields de cliente / ninguna]
```

### SANITY (si aplica)
```
Esquemas a crear:
- sanity/schemas/[path] — descripción

Queries GROQ:
- sanity/queries/[path] — descripción

Tipos TypeScript:
- sanity/types/[path] — descripción

Registrar en sanity/schemas/index.ts: [sí/no]
Agregar a hiddenDocTypes en sanity/desk/index.ts: [sí/no]
```

### COMPONENTES
```
Nuevos componentes:
- components/[path] — Client/Server — descripción

Componentes a modificar:
- components/[path] — qué cambia
```

### PÁGINAS
```
Nuevas páginas:
- app/(frontend)/[path]/page.tsx — descripción

Páginas a modificar:
- [ruta] — qué cambia
```

### CASOS BORDE A MANEJAR
Listar todos los casos borde identificados en la Fase 1:
- Variantes agotadas
- Producto eliminado de Shopify
- Estados vacíos
- Estados de carga
- Estados de error en mutations
- Casos específicos de la funcionalidad

Guardar en:
`.claude/plans/shopify-[feature]/03-implementation-plan.md`

**Esperar aprobación antes de la Fase 4.**

---

## FASE 4: IMPLEMENTACIÓN SHOPIFY

Usar la skill **shopify-storefront** en MODO 2.

Ejecutar en este orden exacto:

1. **Nuevos GraphQL fragments** en lib/shopify.js
   - Seguir el patrón de CART_LINES_FRAGMENT existente
   - Usar template literals con nombre descriptivo en SNAKE_CASE

2. **Nuevas funciones de query** en lib/shopify.js
   - Seguir el patrón: `export async function nombreFuncion(params)`
   - Usar `shopifyData(QUERY, { variables })`
   - Retornar solo los datos necesarios del response

3. **Nuevas funciones de mutation** si se necesitan
   - Mismos patrones que cartCreate, cartLinesAdd
   - Incluir manejo de errores en el response

4. **Extender shopContext.js** si hay estado de carrito o sesión involucrado
   - Agregar estado nuevo al initialState
   - Agregar acción al reducer / handlers
   - Exponer via contexto

5. **Nuevos hooks en hooks/** si hay lógica reutilizable
   - Ejemplo: hooks/useWishlist.tsx, hooks/useRecentlyViewed.tsx

6. `npm run lint` — sin errores antes de continuar

**Esperar aprobación antes de la Fase 5.**

---

## FASE 5: IMPLEMENTACIÓN SANITY (omitir si no aplica)

Usar la skill **sanity-schema-builder** en MODO 2.

Solo si la Fase 2 definió que se necesita contenido CMS:

1. **Esquemas** siguiendo convenciones del proyecto:
   - Documentos en `sanity/schemas/documents/`
   - Singletons en `sanity/schemas/singletons/`
   - Objetos en `sanity/schemas/objects/[dominio]/`

2. **Registrar en `sanity/schemas/index.ts`**
   - Agregar a los arrays correspondientes

3. **Agregar a `hiddenDocTypes` en `sanity/desk/index.ts`**
   - Evitar duplicados en el panel raíz de Sanity Studio

4. **Tipos TypeScript**
   - Crear en `sanity/types/[dominio]/`
   - Exportar desde `sanity/types/index.ts`

5. **Queries GROQ** de abajo hacia arriba:
   - Primitivos → Fragmentos → Queries completas
   - Guardar en `sanity/queries/`
   - Exportar desde `sanity/queries/index.tsx`

6. `npm run lint` — sin errores antes de continuar

**Esperar aprobación antes de la Fase 6.**

---

## FASE 6: IMPLEMENTACIÓN DE COMPONENTES

Usar la skill **figma-maquetador** si existe referencia Figma.

Un componente a la vez, en este orden (dependencias primero):

1. **Desktop primero**, mobile dentro del mismo componente
2. **SCSS co-localizado** usando mixins y variables del proyecto:
   - Importar desde `styles/common/_variables.scss`
   - Importar desde `styles/mixins/_mixins.scss`
   - Usar `responsive($class)` para breakpoints
   - Usar `px()` para conversión de rem
3. **LazyImage** para todas las imágenes — nunca `<img>` nativo
4. **LazyVideo** para todos los videos — nunca `<video>` nativo
5. **Next.js Link** para navegación interna
6. **Server Components** hacen fetch de datos a nivel de página y pasan props
7. **Client Components** usan shopContext.js para interacciones de carrito

Manejar cada caso borde de la Fase 1:
- **Variantes agotadas:** deshabilitar botón, mostrar mensaje
- **Productos sin metafields requeridos:** fallback visual gracioso
- **Estado vacío:** mensaje significativo (wishlist vacía, sin resultados)
- **Estado de carga:** skeleton o spinner mientras se resuelven mutations
- **Estado de error:** mensaje de error en mutations fallidas

Accesibilidad:
- `prefers-reduced-motion` en cualquier animación
- `aria-live` para cambios de estado dinámicos
- Navegación por teclado funcional
- Gestión de foco en modales o paneles

`npm run lint` después de cada componente.

**Esperar aprobación antes de la Fase 7.**

---

## FASE 7: INTEGRACIÓN EN PÁGINAS

1. Integrar componentes en páginas existentes o nuevas
2. **Conectar queries de Shopify a nivel de página** (Server Component):
   - Llamar funciones de `lib/shopify.js` directamente
   - Nunca desde Client Components
3. **Pasar datos como props** — sin lógica de negocio en page.tsx
4. **generateMetadata** si se crean nuevas páginas:
   - Usar seoHelper.ts si existe, o patrón existente en el proyecto
   - Usar skill **seo-metadata** en MODO 1
5. **Promise.all** para fetches independientes en paralelo
6. `npm run build` — sin errores antes de continuar

**Esperar aprobación antes de la Fase 8.**

---

## FASE 8: VERIFICACIÓN DE CASOS BORDE

Verificar que cada caso borde de la Fase 1 está manejado:

### INVENTARIO
- [ ] Todas las variantes agotadas — UI refleja no disponibilidad
- [ ] Algunas variantes agotadas — variante correcta deshabilitada
- [ ] Producto eliminado de Shopify — fallback gracioso

### DATOS DE USUARIO (si hay persistencia involucrada)
- [ ] Primera visita — estado vacío manejado
- [ ] localStorage no disponible — fallback gracioso
- [ ] Datos de sesión anterior cargan correctamente

### POR FUNCIONALIDAD ESPECÍFICA

**Wishlist:**
- [ ] Agregar/quitar funciona correctamente
- [ ] Persiste entre navegación de páginas
- [ ] Productos eliminados de Shopify muestran fallback gracioso
- [ ] Wishlist vacía tiene estado vacío significativo

**Filtros de colección:**
- [ ] Estado sin resultados manejado
- [ ] URL refleja filtros activos
- [ ] Filtros se resetean correctamente
- [ ] Panel de filtros mobile abre y cierra

**Comparador de productos:**
- [ ] Límite máximo de productos aplicado
- [ ] Quitar un producto funciona
- [ ] Tabla de comparación maneja campos faltantes graciosamente

**Productos bundle:**
- [ ] Todos los items del bundle en stock antes de permitir agregar al carrito
- [ ] Stock parcial manejado
- [ ] Precio del bundle calculado correctamente

**Esperar aprobación antes de la Fase 9.**

---

## FASE 9: REVISIÓN FINAL

Usar skill **debug-performance** en MODO 1 y skill **seo-metadata**
en MODO 1 si se crearon nuevas páginas.

### TÉCNICO
- [ ] `npm run lint` sin errores
- [ ] `npm run build` sin errores
- [ ] Sin `use client` innecesario
- [ ] Sin GraphQL inline en componentes
- [ ] Sin llamadas directas a Storefront API desde Client Components
- [ ] Sin lógica de carrito fuera de shopContext.js
- [ ] Sin valores hardcodeados que deberían ser variables SCSS

### INTEGRACIÓN SHOPIFY
- [ ] Todas las funciones nuevas en lib/shopify.js siguen patrones existentes
- [ ] Manejo de errores presente en todas las mutations
- [ ] Sin over-fetching en nuevas queries (solo campos necesarios)

### ACCESIBILIDAD
- [ ] Navegación por teclado funciona para la nueva funcionalidad
- [ ] Lector de pantalla anuncia cambios de estado con aria-live
- [ ] Gestión de foco correcta en modales o paneles
- [ ] Todos los elementos interactivos alcanzables por Tab

Guardar reporte final en:
`.claude/plans/shopify-[feature]/04-final-review.md`

---

## REGLAS DEL AGENTE

- **Nunca implementar antes de entender las restricciones de la Storefront API**
- **Nunca tomar decisiones de arquitectura de forma autónoma**
- **Nunca saltar la identificación de casos borde en la Fase 1**
- **Nunca agregar lógica de carrito fuera de shopContext.js**
- **Nunca llamar lib/shopify.js directamente desde Client Components**
- Si una funcionalidad requiere configuración de tienda Shopify,
  detener e indicar al desarrollador exactamente qué hacer en
  Shopify Admin antes de continuar
- Si hay bloqueo o incertidumbre, detener y preguntar
- Guardar todos los archivos de plan antes de pedir aprobación
- Usar las skills existentes — nunca reinventar su lógica
