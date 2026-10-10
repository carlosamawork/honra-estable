# Guía del administrador — Honra

Dónde se edita cada elemento de la web. El admin está en **/admin** (por ejemplo `https://honra.es/admin`).
Los cambios se publican con el botón **Publish** de cada documento y tardan hasta 1 minuto en verse en la web.

## Dos admins, dos cosas distintas

| Qué quiero cambiar | Dónde |
|---|---|
| Nombre, precio, descripción, variantes, stock, colores de un producto | **Shopify** (admin de la tienda) |
| Imágenes editoriales, características, módulos, relacionados, SEO del producto | **Sanity** → Products |
| Textos, imágenes y páginas de la web | **Sanity** |

## Mapa del admin de Sanity

### Home
Sanity → **Home**
- Pestaña **Editorial** → **Hero**: imagen de fondo y logo del hero.
- **Modules**: bloques de la home. Cada módulo tiene columnas (1 a 8), altura (Auto, Medium, Full) e items: imagen, texto o producto.
- Pestaña **SEO**: título, descripción e imagen para Google y redes.

### About
Sanity → **About**
- **Hero**: imagen, texto de arriba (Text above) y texto de abajo (Text below).
- **Modules**: igual que en Home.
- **SEO**.

### Páginas Explore
Sanity → **Pages**
- Cada documento es una página con URL propia: `/{slug}/`.
- **Title**, **Slug** (la URL), **Hero** (título, subtítulo, imagen), **Modules**, **SEO**.

### Shop
Sanity → **Shop**
- **Modules**: contenido que aparece debajo del grid de productos (imágenes de campaña).
- El grid de productos se alimenta de Shopify. El orden se cambia en **Product order**.

### Productos
Sanity → **Products** → elegir producto
- Pestaña **Editorial**:
  - **Hover Image**: imagen al pasar el ratón en el grid de la tienda.
  - **Images**: galería editorial.
  - **Characteristics**: acordeones de la ficha (título, imagen y texto cada uno).
  - **Modules**: bloques debajo de la ficha.
  - **Custom product options**: color hex de cada variante, si Shopify no lo aporta.
  - **Related products**.
- Pestaña **Shopify sync**: datos que llegan de Shopify (solo lectura).
- Pestaña **SEO**.

### Colecciones
Sanity → **Collections**. Hero (título, descripción) y SEO. El listado de productos viene de Shopify.

### Textos legales
Sanity → **Legals**
- Un documento por texto: Terms of Use, Privacy Policy, Shipping and Return, etc.
- **Title**, **Slug** (URL: `/legals/{slug}/`), **Body** y **SEO**.
- Para que aparezca en el footer, añadir su URL en Settings → Footer → Legal links.

### Settings (elementos generales)
Sanity → **Settings**. Tiene estas pestañas:

| Pestaña | Qué controla |
|---|---|
| **Navigation** | **Header menu**: links del header (desktop muestra los 3 primeros, móvil todos). **Footer**: Primary links, Legal links, Claim (frase de marca) y Legal line (datos de empresa y copyright). |
| **Brand** | **Header logo**, **Footer logo**, **Social handle** (p. ej. @honra.world), **Social URL** y **Contact email** (ambos salen en el footer móvil). Si no se sube logo se usa el logo por defecto. |
| **Labels** | Textos de botones: Cart, Add to cart, Sold out, mensaje de carrito vacío, etiqueta de cantidad, Checkout. |
| **Cookies** | Todos los textos del banner de cookies y los dos botones. |
| **404 page** | Título y texto de la página de error. |
| **SEO** | Título, descripción e imagen por defecto de toda la web. |

Cada link tiene **Title** (texto), **URL** (p. ej. `/shop/` o `https://...`) y **New window**.

## Shopify

Acceso: admin de la tienda en `https://honra-shop.myshopify.com/admin` con la cuenta **admin@honra.co**.
La web solo lee de Shopify. Todo lo que se cambie aquí llega a la web en un minuto, sin tocar Sanity.

### Qué sale de Shopify en la web
| Elemento de la web | Dónde se edita en Shopify |
|---|---|
| Nombre del producto | Products → producto → **Title** |
| Texto de la ficha | Products → producto → **Description** |
| Precio | Products → producto → **Variants** → Price |
| Agotado / disponible | Products → producto → **Inventory**. Si la cantidad es 0, el botón pasa a "Sold out". |
| Colores (selector de la ficha) | Products → producto → **Options** → una opción llamada `Color` con un valor por color |
| Color del círculo de cada variante | El **swatch** del valor de la opción Color, o el metafield **Color pattern** de la categoría |
| Galería de cada color | Variante → **imagen de la variante** (sale primero) + metafield **Gallery** de la variante (resto de fotos) |
| Galería de un producto sin colores | Products → producto → **Media** |
| Imagen en el grid de la tienda | Primera imagen de **Media** (la imagen hover se pone en Sanity) |
| Productos de una colección | Products → **Collections** |
| Checkout, envíos, pagos, descuentos, pedidos | Shopify, como en cualquier tienda |

### Para que un producto aparezca en la web
1. En Shopify, el producto tiene que estar en **Status: Active** y publicado en el canal **Online Store**.
2. Shopify lo sincroniza solo con Sanity (app Sanity Connect). Al minuto aparece en Sanity → Products.
3. Si en Sanity sale "(Unavailable in Shopify)", el producto está en borrador o archivado en Shopify.
4. El orden del grid de la tienda se cambia en Sanity → **Product order**.
5. En Sanity → Products → producto se completan la imagen hover, las características y el SEO.

### Galería por color
Cada variante (color) tiene su propia galería: la imagen asignada a la variante va primero y después las del metafield **Gallery**. Para añadir fotos a un color: Products → producto → Variants → elegir la variante → sección **Metafields** → **Gallery** → añadir imágenes. Si un producto no tiene colores, se usan las fotos de **Media**.

## Imágenes
- Se suben desde el campo de imagen (icono de carpeta) o desde **Media** en el menú superior del admin.
- Formatos: JPG o PNG para fotos, SVG o PNG para logos.
- Rellenar siempre **Alt text**: lo usan Google y los lectores de pantalla.

## Lo que no se edita desde el admin
- Colores, tipografías y disposición de las páginas (son diseño, no contenido).
- Datos de producto que vienen de Shopify (ver tabla de arriba).
- Favicon e imagen por defecto de redes (`/images/honra_og.jpg`): se cambian en el código.
