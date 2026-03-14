# SKILL: Shopify Storefront

Activa este skill cuando el desarrollador necesite implementar funcionalidad
relacionada con Shopify: productos, colecciones, variantes, carrito, o
autenticación de clientes.

---

## MODO 1: REVISIÓN DE ARQUITECTURA

Activa cuando el desarrollador describe un requisito Shopify SIN especificación
completa. Claude NUNCA escribe GraphQL ni componentes en este modo.

Preguntar antes de cualquier código:
- ¿Qué dato se necesita? (producto, colección, variante, cliente, metafields)
- ¿Es consulta nueva o extensión de una existente?
- ¿Necesita datos en tiempo real o puede ser estático/cacheado?
- ¿Hay restricciones de inventario o disponibilidad de variante?
- ¿Involucra mutaciones de carrito o solo lectura?
- ¿Intervienen metafields? Si sí: namespace y key exactos
- ¿Necesita paginación?

Producir resumen escrito del enfoque. Esperar aprobación explícita antes de MODO 2.

---

## MODO 2: IMPLEMENTACIÓN

Solo activa después de aprobación en MODO 1, o con especificación completa.
Esperar aprobación entre cada paso.

### PASO 1 — Queries GraphQL (`lib/shopify.js`)

Todo el GraphQL vive en `lib/shopify.js`. Nunca inline en componentes o páginas.

**Patrón base:**
```js
export async function shopifyData(query, variables) {
  const graphQLClient = new GraphQLClient(
    `https://${domain}/api/${apiVersion}/graphql.json`,
    { headers: { 'X-Shopify-Storefront-Access-Token': token } }
  )
  return await graphQLClient.request(query, variables)
}
```

**Reglas críticas:**
- Usar SIEMPRE variables tipadas en `shopifyData(query, variables)` — NUNCA interpolar valores en el string GraphQL (riesgo de inyección)
- Reutilizar funciones existentes antes de crear nuevas
- Devolver datos normalizados, nunca el response raw

**Patrón para nueva query de producto:**
```js
export async function getProduct(handle) {
  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id title handle descriptionHtml
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 10) { edges { node { url altText } } }
        variants(first: 100) {
          edges {
            node {
              id title availableForSale
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
            }
          }
        }
      }
    }
  `
  const data = await shopifyData(query, { handle })
  return data.product ?? null
}
```

### PASO 2 — Cart API (`lib/shopify.js`)

El proyecto usa **Shopify Cart API** (no el deprecated Checkout API).
Todas las funciones de carrito del proyecto:

```js
// Fragmento reutilizable en todas las mutaciones de carrito
const CART_LINES_FRAGMENT = `
  id checkoutUrl
  lines(first: 100) {
    edges { node { id quantity merchandise { ... on ProductVariant { id } } } }
  }
`

cartCreate(variantGid, quantity)      // → cart { id, checkoutUrl, lines }
cartLinesAdd(cartId, variantGid, quantity) // → cart actualizado
cartLinesUpdate(cartId, lineId, quantity)  // → cart actualizado
cartLinesRemove(cartId, lineIds[])         // → cart actualizado
```

Variables de mutación:
- `cartCreate`: `{ input: { lines: [{ merchandiseId: variantGid, quantity }] } }`
- `cartLinesAdd`: `{ cartId, lines: [{ merchandiseId: variantGid, quantity }] }`
- `cartLinesUpdate`: `{ cartId, lines: [{ id: lineId, quantity }] }`
- `cartLinesRemove`: `{ cartId, lineIds: [lineId] }`

### PASO 3 — Carrito (`context/shopContext.js`)

**Estado real del contexto:**
```js
{
  cart[],       // Items locales — cada item tiene lineId (Cart API line ID)
  cartOpen,     // boolean — slide-out visible
  isOpen,       // boolean — modal/overlay visible
  cartId,       // string — Cart API cart GID
  checkoutUrl,  // string — URL de checkout Shopify
  pageIsLoaded, // boolean
  menuOpen,     // boolean
}
```

**Shape de un item en `cart[]`:**
```js
{
  lineId: string,          // ID de línea del Cart API (requerido para update/remove)
  store: { gid: string },  // Variant GID de Sanity (usado para identificar el item)
  title: string,
  productId: string,
  variantQuantity: number,
  image: string,
}
```

**Acciones disponibles en CartContext:**
```js
addToCart(newItem, quantity, productId, title, image)
// newItem = objeto variant de Sanity (necesita newItem.store.gid)

updateCartItem(item, quantity)
// item = item del cart[] (necesita item.lineId y item.store.gid)

removeCartItem(variantGid)
// variantGid = item.store.gid — busca lineId internamente

changePageIsLoaded()
```

**Persistencia:** `localStorage.cart_v2` → `JSON.stringify([cartItems, { id: cartId, checkoutUrl }])`

**Lógica de `addToCart`:**
1. Si `cart.length === 0` → `cartCreate` → `syncLineIds` → guardar
2. Si variante ya está en el carrito (por `store.gid`) → `cartLinesUpdate` con `lineId`
3. Si variante nueva → `cartLinesAdd` → `syncLineIds` → añadir al array

Nunca duplicar lógica de carrito fuera de `shopContext.js`.

### PASO 4 — Componentes

- Server Components: llamar funciones de `lib/shopify.js` directamente en `page.tsx`
- Client Components: solo interacción de carrito vía `CartContext`
- Usar `LazyImage` para imágenes de producto Shopify
- Usar `<Link>` de Next.js para navegación interna (`/products/[handle]`)

```tsx
// page.tsx (Server Component)
import { getProduct } from '@/lib/shopify'
export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle)
  return <ProductView product={product} />
}

// ProductAddToCart.tsx (Client Component)
'use client'
import { useContext } from 'react'
import { CartContext } from '@/context/shopContext'
export function ProductAddToCart({ variant, productId, title, image }) {
  const { addToCart } = useContext(CartContext)
  return (
    <button onClick={() => addToCart(variant, 1, productId, title, image)}>
      Añadir al carrito
    </button>
  )
}
```

### PASO 5 — Verificación

- `npm run lint` — sin errores
- Sin GraphQL inline en componentes
- Sin llamadas directas a Storefront API fuera de `lib/shopify.js`
- Sin mutaciones de carrito fuera de `shopContext.js`

---

## CONEXIÓN SANITY ↔ SHOPIFY

Los documentos `product` y `productVariant` en Sanity se sincronizan desde
Shopify vía `shopify-sanity-connect`. Cada documento tiene un campo `store`
que espeja los datos de Shopify.

```
Sanity product.store          → type: shopifyProduct
Sanity productVariant.store   → type: shopifyProductVariant
```

El `store.gid` del variant (string, ej. `gid://shopify/ProductVariant/12345`) es
el `merchandiseId` que usa el Cart API.

**GROQ típico para producto:**
```groq
*[_type == "product" && store.slug.current == $slug][0] {
  _id,
  "title": store.title,
  "slug": store.slug.current,
  "price": store.priceRange.minVariantPrice,
  "previewImageUrl": store.previewImageUrl,
  "variants": store.variants[]-> {
    "gid": store.gid,
    "title": store.title,
    "price": store.price,
    "compareAtPrice": store.compareAtPrice,
    "available": store.inventory.isAvailable,
    "option1": store.option1,
    "option2": store.option2
  }
}
```

---

## CASOS LÍMITE

**Inventario:**
- Todo agotado: botón deshabilitado, verificar `store.inventory.isAvailable`
- Variantes parciales: filtrar por `variant.store.inventory.isAvailable`
- Sin tracking: `store.inventory.management === 'NOT_MANAGED'` → siempre disponible
- Producto sin variantes: usar primera variante directamente, ocultar selector

**Precios:**
- Oferta: `compareAtPrice > 0 && compareAtPrice > price`
- Rango: usar `store.priceRange.{minVariantPrice, maxVariantPrice}`
- Gratuito: `price === 0` → mostrar "Gratis"

**Carrito:**
- Sin variante seleccionada: no llamar `addToCart` — mostrar error en UI
- Actualizar a cantidad 0: llamar `removeCartItem(item.store.gid)`
- Items no disponibles al cargar: verificar `store.inventory.isAvailable` en montaje
- Persistencia: restaurado automáticamente desde `localStorage.cart_v2` en `useEffect`

**Media:**
- Imagen principal: `store.previewImageUrl` (URL string, no objeto Sanity image)
- Galería: query separada a Storefront API — no está en schema de Sanity
- Alt text: usar `store.title` como fallback

---

## MEJORAS DETECTADAS (al generar el skill)

| # | Archivo | Problema | Impacto |
|---|---------|----------|---------|
| 1 | `lib/shopify.js:119,183` | `getUser` y `resetPassword` interpolaban valores directamente en el string GraphQL — vulnerabilidad de inyección — **CORREGIDO** | ALTO |
| 2 | `lib/shopify.js:28-86` | Usaba deprecated Checkout API — **MIGRADO a Cart API** | ALTO |
| 3 | `context/shopContext.js:76` | `addToCart` usaba `cart.map()` para detectar duplicados — **CORREGIDO con `find()`** | ALTO |
| 4 | `context/shopContext.js:113` | `removeCartItem` filtraba por `productId` — imposible tener mismo producto con distintas variantes — **CORREGIDO por `variantGid`** | MEDIO |
| 5 | `context/shopContext.js` | Sin manejo de errores en mutaciones de carrito — **CORREGIDO con try/catch** | MEDIO |
| 6 | `lib/shopify.js` | No existen queries para productos ni colecciones — pendiente según necesidad | MEDIO |
| 7 | `lib/shopify.js` / `context/` | Sin TypeScript — sin seguridad de tipos en items del carrito | BAJO |
