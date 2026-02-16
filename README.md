# Next.js + Sanity

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), integrated with [Sanity](https://www.sanity.io/) as a headless CMS. SCSS is used for styling.

---

## Table of Contents

1. [Setup](#1-setup)  
2. [Project Structure](#2-project-structure)  
   - [Routing Rules](#routing-rules)  
   - [Folder Responsibilities](#folder-responsibilities)  
3. [Files to edit on setup](#3-files-to-edit-on-setup)  

---

## 1. Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
```
2. Install dependencies:

```bash
npm update
npm install
```

3. Initialize Sanity:

```bash
sanity init
```

4. Choose a project name and dataset when prompted.

5. Environment Variables
Create a .env.local file in the root of the project and set the following variables:

CLIEN_ID=NAMEINCAPS (we will use it for the cookies, no spaces, just an identifier)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=

6. Sanity Configuration
Give Sanity access to the URLs where the frontend will be running.

7. Run project:

```bash
npm run dev
```

The project will be available at:
➡️ http://localhost:3000

---

## 2. Project Structure

This project uses the **Next.js App Router**, meaning **every folder inside `/app` automatically becomes a route**.  
Each route folder contains a `page.tsx` file (or subroutes with dynamic segments) that defines what is rendered.

### Routing Rules

- Every folder inside `/app` is automatically a **route**.
- `page.tsx` inside a folder defines the **main page component** for that route.
- if you need a specific css for the page, add it in the folder together with the page.tsx (componentName.module.scss)
- Dynamic routes use:
  - `[slug]`
- Nested folders represent nested routes (e.g., `/designers/country/[slug]`).
- Avoid global or shared page-level styles — styling must be located with the route.


### Folder Responsibilities

- **app**  
  This is the core of the Next.js App Router.
  Contains both the **frontend** and **admin** sections, including layouts, pages, and API routes.  

- **app/(admin)**
  Contains the admin layout and admin-facing pages.  
  **Do not modify this folder unless necessary.**  
  Completely isolated from the frontend.
  Already includes all required structure and styles.
  
- **app/(frontend)**  
  Contains the files we will use for our project.
  Make sure to use the corresponding naming of folder, component and scss styles (when needed).

- **components**  
  Reusable UI components.  
  Every component **must include**:  
  - `index.tsx`
  - a corresponding SCSS module (e.g., `ComponentName.module.scss`)  
  All component styling is co-located.

- **context / hooks**  
  Context to hold any cross page information.

- **context / hooks**  
  Custom hooks used for shared.

- **sanity**  
  Contains everything related to the Sanity CMS, including:  
  - Document and object schemas  
  - Custom input components  
  - GROQ queries  
  - Desk structure  
  - Sanity utilities  
  This folder represents the structure and behavior of the CMS backend.

- **sanity/sanity-utils**  
  This folder contains all reusable GROQ utilities used to build queries:

  - primitives → low-level building blocks
    Small, reusable pieces such as:
	  body.ts
	  imageData.ts
	  videoData.ts
	Used inside fragments and modules.
 
  - fragments → reusable document-level GROQ fragments
    Represents the base data shape for a single Sanity document type:
      product.ts
	  project.ts
	  category.ts
	  fabric.ts
    These serve as the foundation for page queries.
  
  - modules → module-level fragments
    Larger composed blocks used on pages (carousel, gallery, lists, etc.).
	  They combine primitives + fragments.
  
  - queries → full-page GROQ queries
    Complete page-level queries like home, product, project, shop, etc.
    Each query uses:
	  fragments for base entity structure
	  modules for content blocks
	  primitives for shared fields

- **styles**  
  Global SCSS styling. Includes:  
  - Base styles  
  - Variables  
  - Typography  
  - Mixins  
  - Helpers  
  These files are intended for **global use only**, not for component-specific styling.

- **utils**  
  General helper functions used across the project (formatting, text helpers, validation, etc.).

---

## 3. Files to edit on setup

- **README**  
  Update the repo url on this file
- **.env.local**  
  Make sure to add the keys we need and update the Client ID
