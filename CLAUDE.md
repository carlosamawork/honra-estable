# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm run test     # Vitest unit tests
npm run test:e2e # Playwright E2E tests
```

## Architecture

**Honra** is a Next.js 15 (App Router) + Sanity CMS + Shopify e-commerce/portfolio site.

### Data Flow

```
Browser → Next.js Server Components → GROQ queries → Sanity CMS
                                    → Shopify Storefront GraphQL API
```

Pages are async server components that fetch data at request time.
Shopify integration lives in `lib/shopify.js` (GraphQL).
Cart state is managed in `context/shopContext.js` via localStorage.

### Key Layers

- **`app/(frontend)/`** — Public pages (server components).
- **`app/(admin)/`** — Embedded Sanity Studio at `/admin`. Do NOT modify unless explicitly asked.
- **`components/`** — Each component lives in its own folder: `components/ComponentName/index.tsx` + `ComponentName.module.scss` (co-located styles mandatory).
- **`sanity/queries/`** — GROQ queries in layers:
  - `primitives/` — Field-level reusable fragments (image, body, SEO fields)
  - `fragments/` — Document-shape projections (product, page, collection)
  - `modules/` — Content block projections
  - `queries/` — Full page queries composing the above
  - `common/` — Shared queries (header, footer, settings, SEO)
- **`sanity/schemas/`** — CMS type definitions: `documents/`, `singletons/`, `objects/`, `blocks/`, `taxonomies/`, `annotations/`
- **`styles/`** — Global SCSS only (variables, mixins, fonts, reset).
- **`utils/seoHelper.ts`** — Builds metadata, URLs, favicons.
- **`context/`** — `shopContext.js` (cart), `webContext.js` (site-wide state)

---

## Styling Rules

- SCSS modules are **always** co-located with the component — no exceptions.
- Global styles go only in `/styles/common/`, `/styles/mixins/`, `/styles/fonts/`.
- Tailwind utilities can be used alongside SCSS modules, not as a replacement.
- Never add component-specific styles to `/styles/`.

---

## Code Conventions

- TypeScript strict mode — no `any`, always explicit return types on exported functions.
- Prettier: no semicolons, single quotes, no bracket spacing, 100-char line width.
- Path alias `@/*` maps to project root — always use it for imports.
- Named exports only — no default exports in components.
- Functional components only.

### GROQ Query Patterns

- Compose queries bottom-up: primitives → fragments → modules → queries.
- Never write inline GROQ in page components — always import from `sanity/queries/`.
- Name fragments descriptively: `productCardFragment`, `seoFragment`.

### Shopify GraphQL Patterns

- All Storefront API calls go through `lib/shopify.js` — never call the API directly from components.
- Use GraphQL fragments for reusable product/collection fields.
- Cart mutations must go through `context/shopContext.js`.

---

## Sanity Content Model

**Singletons:** `home`, `settings`
**Documents:** `page`, `product`, `collection`, `legal`

- Content rendered via `@portabletext/react`.
- Images served through Sanity CDN + Next.js `<Image>` optimization.
- When adding a new document type, always create: schema → GROQ fragment → page query → page component.

---

## Testing

- **Unit tests:** Vitest + React Testing Library, co-located with the component (`ComponentName.test.tsx`).
- **E2E tests:** Playwright, in `/e2e` folder.
- Test coverage minimum: 80% for utility functions and hooks.
- Use semantic locators (`getByRole`, `getByLabel`) — never query by CSS class or test ID unless unavoidable.
- For E2E, always use `webServer` config in `playwright.config.ts` to start the dev server automatically.

---

## Figma → Component Workflow

When implementing a design from Figma:
1. Fetch design context via Figma MCP using the frame URL.
2. Identify which existing components can be reused or extended.
3. Map Figma tokens (colors, spacing, typography) to existing SCSS variables — never hardcode values.
4. Create the component folder: `components/ComponentName/index.tsx` + `ComponentName.module.scss`.
5. If the design introduces new global tokens, add them to `/styles/common/_variables.scss`.

---

## Behaviour Rules

- Always read a file before modifying it.
- Never modify more than one feature at a time — ask for confirmation before scope expansion.
- Never commit without asking first.
- If something is unclear, ask before assuming — especially for Sanity schema changes or Shopify cart logic.
- When creating a new component, always check `components/` for an existing similar one first.
- `BASE_URL` in `utils/seoHelper.ts` must be updated before any production deployment — warn the user if it still has a placeholder value.

---

## Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=znbv3k2l
NEXT_PUBLIC_SANITY_DATASET=production
SHOPIFY_STOREFRONT_ACCESSTOKEN=...
SHOPIFY_STORE_DOMAIN=honra-shop.myshopify.com
```

---

## Common Mistakes to Avoid

- Do NOT put component styles in `/styles/` — always co-locate.
- Do NOT modify `app/(admin)/` unless explicitly instructed.
- Do NOT call Shopify Storefront API outside of `lib/shopify.js`.
- Do NOT write GROQ queries inline in page components.
- Do NOT use `any` in TypeScript — find the correct type or create one.
- Do NOT use default exports for components.

## Skills — cuando usarlos

- Cualquier tarea relacionada con SEO, metadata o structured 
  data → usar skill seo-metadata
- Cualquier implementación desde Figma → usar skill figma-maquetador
- Cualquier schema de Sanity o query GROQ → usar skill sanity-schema-builder
- Cualquier animación o efecto 3D → usar skill animaciones-3d
- Cualquier integración con Shopify → usar skill shopify-storefront
- Cualquier problema de rendimiento → usar skill debug-performance
- Cualquier renderer de PortableText → usar skill portabletext-renderer