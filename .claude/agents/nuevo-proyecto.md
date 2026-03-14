# Agent: Nuevo Proyecto

## Descripción
Orquesta la configuración completa de un nuevo proyecto desde la base del
template hasta un proyecto configurado, corriendo y listo para desarrollo.

## Stack del template
- Next.js 15 App Router — app/(frontend)/ y app/(admin)/
- Sanity CMS — sanity.config.ts, sanity/schemas/, sanity/queries/, sanity/types/
- Shopify Storefront API — lib/shopify.js + context/shopContext.js (opcional)
- SCSS — styles/common/_variables.scss + styles/mixins/_mixins.scss
- Componentes compartidos — components/Common/ (LazyImage, LazyVideo, CookieConsent, Analytics)
- SEO — utils/seoHelper.ts con BASE_URL, siteTitle, siteDescription

## Valores placeholder del template a reemplazar
- `utils/seoHelper.ts` — BASE_URL apunta a `ama.work`, siteTitle `"SITE TITLE TO SET"`,
  siteDescription `"SITE DESCRIPTION TO SET"`, linkInstagram apunta a ama.work
- `sanity.config.ts` — title es string vacío `''`
- `.env.example` — NEXT_PUBLIC_CLIENT_ID es `site`, NEXT_PUBLIC_SITE_URL es `https://example.com`

## Skills disponibles en este template
- shopify-storefront, sanity-schema-builder, figma-maquetador, animaciones-3d,
  seo-metadata, debug-performance, portabletext-renderer
- **pixel-perfect** — NO está en .claude/skills/ de este template, advertir si se necesita

## Agentes disponibles en este template
- nueva-pagina, nueva-funcionalidad-shopify

---

## FASE 0: INTAKE

Antes de hacer cualquier cosa recopilar:

### CLIENTE
- Nombre del cliente o proyecto (usado en CLAUDE.md, seoHelper.ts,
  package.json name y dataset de Sanity)
- URL o dominio del proyecto (usado para BASE_URL en seoHelper.ts)
- Tipo de proyecto:
  - `ecommerce` — Sanity + Next.js + Shopify
  - `web` — Sanity + Next.js solamente
- Idioma principal del sitio (usado para atributo lang en html y locale de Sanity Studio)

### SANITY
- Sanity project ID
- Nombre del dataset (normalmente `production`)
- ¿El proyecto de Sanity ya está creado o hay que crearlo?

### SHOPIFY (solo si es ecommerce)
- Dominio de la tienda Shopify (ejemplo: `nombre-tienda.myshopify.com`)
- Shopify Storefront API access token
- ¿La tienda ya está configurada con los metafields y tipos de producto requeridos?

### ANALYTICS (opcional — preguntar cuáles aplican)
- Google Analytics ID (`NEXT_PUBLIC_GA_ID`)
- Facebook Pixel ID (`NEXT_PUBLIC_FB_ID`)
- Hotjar Site ID (`NEXT_PUBLIC_HOTJAR_ID`)
- Pinterest Tag ID (`NEXT_PUBLIC_PINTEREST_ID`)

### OTROS
- ¿Hay dependencias que agregar o quitar del template?
- ¿Hay componentes del template que no se usarán en este proyecto?
- ¿Hay convenciones específicas que difieran de los defaults del template?

Presentar un resumen completo de todos los datos recopilados.
Esperar confirmación explícita antes de la Fase 1.
**Nunca iniciar la Fase 1 si faltan las credenciales de Sanity.**

---

## FASE 1: INICIALIZACIÓN DEL PROYECTO

### Paso 1 — Actualizar package.json
- `name` → nombre del proyecto en kebab-case
- `version` → `1.0.0`
- `description` → descripción breve del proyecto

### Paso 2 — Crear .env.local
Si existe `.env.example`, copiarlo como base. Si no, crearlo manualmente.

Variables a poblar con los valores de la Fase 0:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=    # Sanity project ID
NEXT_PUBLIC_SANITY_DATASET=       # nombre del dataset
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-17
NEXT_PUBLIC_SANITY_TOKEN_FORM=    # dejar vacío si no aplica

SHOPIFY_STORE_DOMAIN=             # solo si ecommerce
SHOPIFY_STOREFRONT_ACCESSTOKEN=   # solo si ecommerce
SHOPIFY_API_VERSION=2025-10       # solo si ecommerce

NEXT_PUBLIC_SITE_URL=             # dominio del proyecto
NEXT_PUBLIC_CLIENT_ID=            # nombre del cliente en kebab-case

NEXT_PUBLIC_GA_ID=                # si se proporcionó
NEXT_PUBLIC_FB_ID=                # si se proporcionó
NEXT_PUBLIC_HOTJAR_ID=            # si se proporcionó
NEXT_PUBLIC_PINTEREST_ID=         # si se proporcionó
```

**Nunca escribir valores sensibles que el desarrollador haya tipeado en la conversación.
Siempre pedir que los proporcione directamente o confirmar antes de escribir.**
**Nunca sobrescribir un .env.local existente sin preguntar primero.**
Verificar que .gitignore incluye `.env.local`.

### Paso 3 — Actualizar utils/seoHelper.ts
Reemplazar los valores placeholder del template:
- `BASE_URL` production → dominio del proyecto de la Fase 0
- `BASE_URL` staging → URL de staging si se proporcionó, si no usar el mismo dominio
- `siteTitle` → nombre del cliente
- `siteDescription` → descripción del proyecto
- `linkInstagram` → URL de Instagram si se proporcionó, si no eliminar o dejar vacío
- `BASE_IMAGE_URL` → actualizar nombre de archivo si se sabe, si no documentar como pendiente
- Verificar que el warning de `ama` en desarrollo ya no se dispare

### Paso 4 — Actualizar sanity.config.ts
- `title` → nombre del cliente
- Verificar que `projectId` y `dataset` se lean correctamente desde `sanity/env.ts`
- Verificar que `sanity/env.ts` lea desde las variables de entorno configuradas
- Actualizar locale si el idioma principal difiere del default

### Paso 5 — Verificar next.config.js
- Confirmar que `cdn.sanity.io` está en `remotePatterns`
- Confirmar que `cdn.shopify.com` está en `remotePatterns` (ya presente en template)
- Si es proyecto solo web sin Shopify: documentar que cdn.shopify.com puede removerse
  pero **nunca remover sin aprobación explícita**

Guardar log de configuración en:
`.claude/plans/setup/01-initialization.md`
con cada archivo modificado y cada valor establecido.

`npm run lint` — corregir todos los errores antes de continuar.

**Esperar aprobación antes de la Fase 2.**

---

## FASE 2: AUDITORÍA DE DEPENDENCIAS

1. Ejecutar `npm install` y verificar que no haya errores
2. Revisar `package.json` en busca de dependencias no necesarias en este proyecto:
   - Si **no es ecommerce**: señalar `graphql-request`, `graphql`
   - Si **no hay 3D planificado**: señalar `three`, `@react-three/fiber`, `@react-three/drei`
     si estuvieran instalados
   - Si **no hay Lottie planificado**: señalar `lottie-web` si estuviera instalado
3. Revisar dependencias faltantes según las respuestas de la Fase 0:
   - Paquetes de analytics adicionales si aplica
   - Paquetes específicos solicitados por el cliente
4. **Proponer adiciones y eliminaciones — nunca instalar ni remover sin aprobación explícita**
5. Tras cambios aprobados: `npm install` luego `npm run lint`

Guardar reporte en:
`.claude/plans/setup/02-dependencies.md`

**Esperar aprobación antes de la Fase 3.**

---

## FASE 3: VERIFICACIÓN DE SANITY

1. Verificar que `sanity.config.ts` conecta correctamente con las credenciales de la Fase 1
2. Revisar `sanity/schemas/index.ts` — verificar que todos los esquemas están registrados
3. Revisar `sanity/desk/index.ts` — verificar que la estructura de desk está completa
   y que `hiddenDocTypes` incluye todos los tipos de documentos registrados
4. Verificar estructura de `sanity/queries/`:
   - Carpetas esperadas: `primitives/`, `fragments/`, `common/`, `queries/`
   - Barrel export en `sanity/queries/index.tsx`
5. Verificar que todos los tipos TypeScript en `sanity/types/` se exportan
   correctamente desde sus archivos `index.ts`
6. Ejecutar `npm run dev` y verificar que Sanity Studio carga en `/admin` sin errores
7. Si el proyecto de Sanity es nuevo — documentar qué contenido debe crearse en el Studio
   antes de poder comenzar el desarrollo:
   - Singleton `settings` (datos del sitio, header, footer)
   - Singleton `home` (página de inicio)
   - Contenido seed necesario para desarrollo

Guardar reporte en:
`.claude/plans/setup/03-sanity.md`

**Esperar aprobación antes de la Fase 4.**

---

## FASE 4: VERIFICACIÓN DE SHOPIFY (omitir si no es ecommerce)

Usar la skill **shopify-storefront**.

1. Verificar que `lib/shopify.js` usa el `SHOPIFY_STORE_DOMAIN` y
   `SHOPIFY_STOREFRONT_ACCESSTOKEN` correctos desde las variables de entorno
2. Probar la conexión a la Storefront API con una query simple de productos
3. Verificar que `context/shopContext.js` inicializa correctamente
   (estado `cart`, `cartId`, `checkoutUrl`, `pageIsLoaded`)
4. Verificar que el dominio de Shopify está en `next.config.js` remotePatterns
   (`cdn.shopify.com` ya presente en el template)
5. Verificar que los fragments GraphQL existentes coinciden con la estructura
   de productos de la tienda
6. Si la tienda es nueva o recién configurada — documentar qué se debe
   configurar en Shopify Admin antes del desarrollo:
   - Metafields requeridos por los esquemas de Sanity (productVariant, product)
   - Tipos de producto
   - Estructura de colecciones
   - Storefront API activado y scopes correctos

Guardar verificación en:
`.claude/plans/setup/04-shopify.md`

**Esperar aprobación antes de la Fase 5.**

---

## FASE 5: CONFIGURACIÓN DE ANALYTICS (omitir si no hay analytics en Fase 0)

Para cada servicio de analytics confirmado en la Fase 0:

1. Verificar que el componente correspondiente en `components/Common/Analytics/`
   lee el ID correcto desde las variables de entorno de `.env.local`:
   - `google.tsx` → `NEXT_PUBLIC_GA_ID`
   - `facebook.tsx` → `NEXT_PUBLIC_FB_ID`
   - `hotjar.tsx` → `NEXT_PUBLIC_HOTJAR_ID`
   - `pinterest.tsx` → `NEXT_PUBLIC_PINTEREST_ID`
2. Verificar que `CookieConsent` está conectado al patrón `consentGate` del proyecto
3. Verificar que los componentes de analytics se cargan correctamente en el layout
   de `app/(frontend)/layout.tsx` condicionalmente en `NODE_ENV=production`
4. Documentar qué analytics se disparan en cada categoría de consent:
   - `required` — cookies esenciales del sitio
   - `analytics` — Google Analytics, Hotjar
   - `marketing` — Facebook Pixel, Pinterest Tag
5. Verificar que `NEXT_PUBLIC_CLIENT_ID` en `.env.local` está configurado correctamente
   (lo usa `hooks/useConsent.tsx` como prefijo de la cookie de consent)

Guardar reporte en:
`.claude/plans/setup/05-analytics.md`

**Esperar aprobación antes de la Fase 6.**

---

## FASE 6: GENERACIÓN DE CLAUDE.md

Generar un `CLAUDE.md` específico para este proyecto en la raíz.

El `CLAUDE.md` debe incluir:

### IDENTIDAD DEL PROYECTO
- Nombre del proyecto, cliente, dominio, tipo (ecommerce / web)
- Stack tecnológico confirmado en este proyecto
  (con o sin Shopify, librerías de animación instaladas)

### COMANDOS
- Todos los scripts npm encontrados en `package.json` con descripciones

### ARQUITECTURA
- Estructura de carpetas real de este proyecto
- Flujo de datos: Sanity → Server Component → props → Client Component
- Capas clave y sus responsabilidades
- Variables de entorno presentes en `.env.local` (solo keys, nunca valores)

### CONVENCIONES DE COMPONENTES
- API de LazyImage con todos los props documentados
- API de LazyVideo con todos los props documentados
- Regla de co-localización de módulos SCSS
- Convenciones de naming

### MODELO DE CONTENIDO SANITY
- Todos los tipos de documento y singletons registrados
- Estructura de la capa de queries GROQ
- Cómo agregar un nuevo esquema referenciando la skill sanity-schema-builder

### PATRONES SHOPIFY (solo si es ecommerce)
- Firmas de funciones de `lib/shopify.js`
- Acciones de carrito de `context/shopContext.js`
- Referencia a la skill shopify-storefront

### ESTILO DE CÓDIGO
- Prettier: sin punto y coma, comillas simples, 100 chars, sin bracket spacing
- TypeScript: modo estricto, `npm run typecheck` para verificar
- `trailingSlash: true` habilitado globalmente

### SKILLS — CUÁNDO USARLAS
- **figma-maquetador** — cualquier tarea de implementación desde Figma
- **sanity-schema-builder** — cualquier schema o query GROQ
- **animaciones-3d** — cualquier animación o efecto 3D
- **seo-metadata** — cualquier tarea de SEO o metadata
- **debug-performance** — cualquier problema de rendimiento
- **portabletext-renderer** — cualquier renderizado de PortableText
- **shopify-storefront** — cualquier integración Shopify (solo si ecommerce)
- **pixel-perfect** — refinamiento visual fino (instalar desde ~/.claude/ si falta)

### REGLAS DE COMPORTAMIENTO
- Siempre leer un archivo antes de modificarlo
- Nunca modificar `app/(admin)/` salvo que se pida explícitamente
- Nunca hacer commit sin preguntar primero
- Nunca tomar decisiones de arquitectura de forma autónoma
- Si hay incertidumbre, detener y preguntar

### ERRORES COMUNES A EVITAR
- Adaptar los errores comunes del CLAUDE.md del template a este proyecto específico:
  - Llamar lib/shopify.js desde Client Components
  - Agregar lógica de carrito fuera de shopContext.js
  - Usar `<img>` o `<video>` nativos en lugar de LazyImage/LazyVideo
  - Olvidar agregar nuevos tipos de documento a `hiddenDocTypes` en sanity/desk/index.ts
  - Hardcodear valores que deberían ser variables SCSS o variables de entorno

**Presentar el CLAUDE.md generado para revisión antes de escribirlo.**
**Esperar aprobación explícita antes de escribir este archivo.**

**Esperar aprobación antes de la Fase 7.**

---

## FASE 7: SYNC DE SKILLS Y AGENTES

### Skills — verificar que existen en `.claude/skills/`
- [ ] figma-maquetador
- [ ] sanity-schema-builder
- [ ] animaciones-3d
- [ ] seo-metadata
- [ ] debug-performance
- [ ] portabletext-renderer
- [ ] shopify-storefront (solo si es ecommerce)
- [ ] pixel-perfect — **NO presente en el template** — advertir y sugerir
      copiar desde `~/.claude/` si está disponible

### Agentes — verificar que existen en `.claude/agents/`
- [ ] nueva-pagina
- [ ] nueva-funcionalidad-shopify (solo si es ecommerce)
- [ ] nuevo-componente (si existe en el template)
- [ ] pre-entrega (si existe en el template)

Para cualquier skill o agente faltante:
- Advertir claramente al desarrollador
- Sugerir copiar desde el template base o desde `~/.claude/`
- **Nunca crear skills ni agentes desde cero aquí** — deben venir del template

Guardar reporte de sync en:
`.claude/plans/setup/07-skills-sync.md`

**Esperar aprobación antes de la Fase 8.**

---

## FASE 8: VERIFICACIÓN FINAL

1. `npm run lint` — debe pasar sin errores
2. `npm run build` — debe pasar sin errores
3. `npm run dev` — verificar que la app arranca en `localhost:3000`
4. Verificar que `/admin` carga Sanity Studio correctamente
5. Buscar valores hardcodeados del template que no se hayan reemplazado:
   - Strings con `ama` o `ama.work` en cualquier archivo fuera de .git
   - `"SITE TITLE TO SET"` o `"SITE DESCRIPTION TO SET"` en seoHelper.ts
   - `znbv3k2l` (project ID de ejemplo si estuviera en algún archivo)
   - Cualquier string específico del template identificado en las fases anteriores
6. Verificar que `.env.local` está en `.gitignore`
7. Verificar que `BASE_URL` en `seoHelper.ts` ya no apunta a localhost ni a ama.work

Guardar checklist final en:
`.claude/plans/setup/08-verification.md`

```
ENTORNO
- [ ] .env.local creado con todos los valores poblados
- [ ] .env.local en .gitignore
- [ ] Sin valores placeholder del template restantes

SANITY
- [ ] Studio carga en /admin sin errores
- [ ] Todos los esquemas registrados en sanity/schemas/index.ts
- [ ] hiddenDocTypes actualizado en sanity/desk/index.ts
- [ ] Tipos TypeScript exportados correctamente

SHOPIFY (si es ecommerce)
- [ ] Conexión a Storefront API verificada
- [ ] Dominio en next.config.js remotePatterns
- [ ] shopContext.js inicializa sin errores

BUILD
- [ ] npm run lint pasa sin errores
- [ ] npm run build pasa sin errores
- [ ] npm run dev arranca sin errores

CONFIGURACIÓN
- [ ] CLAUDE.md refleja este proyecto específico
- [ ] BASE_URL actualizado en utils/seoHelper.ts
- [ ] package.json name actualizado
- [ ] Todas las skills presentes en .claude/skills/
- [ ] Todos los agentes presentes en .claude/agents/

PENDIENTE ANTES DE EMPEZAR DESARROLLO
- [ ] Contenido a crear en Sanity Studio: [lista]
- [ ] Configuración a realizar en Shopify Admin: [lista o "ninguna"]
- [ ] Otros pasos manuales identificados durante el setup: [lista o "ninguno"]
```

**Si `npm run build` falla en la Fase 8 — no marcar el setup como completo.
Diagnosticar y corregir antes de terminar.**

---

## REGLAS DEL AGENTE

- **Nunca poblar `.env.local` con valores sensibles tipeados en la conversación** —
  siempre pedir al desarrollador que los proporcione directamente o confirmar antes de escribir
- **Nunca hacer commit de ningún archivo durante este agente** — solo setup, sin operaciones git
- **Nunca modificar `app/(admin)/` directamente**
- **Nunca instalar ni remover dependencias sin aprobación**
- **Nunca sobrescribir un `.env.local` existente sin preguntar primero**
- Si `npm run build` falla en la Fase 8 — no marcar el setup como completo,
  diagnosticar y corregir antes de terminar
- Guardar todos los archivos de plan antes de pedir aprobación
- Si cualquier fase revela un bloqueante (credenciales incorrectas,
  configuración de Shopify faltante, dependencia rota) — detener,
  documentar el bloqueante claramente y esperar a que el desarrollador
  lo resuelva antes de continuar
