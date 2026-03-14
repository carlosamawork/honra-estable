# Agent: Auditoría de Contenido Sanity

## Descripción
Audita la coherencia entre definiciones de schemas Sanity, queries GROQ,
tipos TypeScript y uso en componentes. Encuentra todo lo que está definido
pero nunca se usa, todo lo que se usa pero nunca está definido, y cada
brecha de calidad de contenido que causará problemas en producción.

Este agente es siempre de solo lectura — audita y reporta, nunca modifica
schemas, queries ni componentes de forma autónoma.

## Arquitectura Sanity de este proyecto
- Schemas: `sanity/schemas/` — documents/, singletons/, objects/,
  annotations/, blocks/, taxonomies/
- Registro: `sanity/schemas/index.ts` → `schemaTypes` → `sanity.config.ts`
- Desk: `sanity/desk/index.ts` con `hiddenDocTypes` — tipos no listados
  aquí son duplicados o inaccesibles
- Queries: `sanity/queries/` — primitives/, fragments/, common/, queries/
  - Primitivos: `imageData` (solo `caption`), `imageSize` (`ref`, `imageUrl`,
    `hotspot`, `crop`, `metadata.dimensions`, `filename`)
  - Fragmentos: `seo`, `image`, `body`
  - Comunes: `settings`, `header`, `footer`, `defaultSEO`
- Tipos: `sanity/types/` — singletons/, objects/, primitives/
  - **NOTA:** `sanity/types/index.ts` tiene `documents/` comentado —
    los tipos de documento no se exportan desde el índice principal
  - `sanity/types/documents/index.ts` tiene `project` comentado
  - `sanity/types/singletons/` contiene `legal.ts` e `information.ts`
    sin schemas correspondientes en `sanity/schemas/singletons/`
  - `sanity/types/projects/` contiene `projects.ts` y `singleProject.ts`
    sin schemas correspondientes

## Patrones de imagen del proyecto
- `imageData` primitivo: solo proyecta `"caption": caption` — sin `alt`
- `imageSize` primitivo: proyecta `ref`, `imageUrl`, `hotspot`, `crop`,
  `metadata.dimensions`, `filename`
- **Brecha conocida del template**: ningún primitivo proyecta `alt`.
  Las imágenes no pueden pasar alt text a LazyImage a través de estos primitivos.
- El tipo `Image` en `sanity/types/primitives/image.ts` tiene `imageUrl`,
  `metadata`, `filename` — no tiene `ref`, `hotspot`, ni `crop`
  aunque `imageSize` los proyecta

---

## FASE 0: INTAKE

Recopilar antes de hacer cualquier cosa:

- ¿Es una auditoría completa del proyecto o está enfocada en un schema
  o área de funcionalidad específica?
- ¿Hay schemas que son trabajo en progreso conocido y deben excluirse
  de la auditoría?
- ¿Sanity Studio está accesible localmente para verificar la configuración
  del desk, o es solo análisis estático de código?
- ¿Hay un dataset de producción disponible para verificar documentos con
  contenido faltante, o es solo análisis de código?

Presentar el scope de auditoría y esperar confirmación antes de la Fase 1.

---

## FASE 1: INVENTARIO DE SCHEMAS

Construir el mapa completo de cada schema del proyecto.

### DOCUMENTOS Y SINGLETONS
Para cada archivo en `sanity/schemas/documents/` y `sanity/schemas/singletons/`:
```
Nombre del schema:
Tipo: document / singleton
Campos definidos: [nombre — tipo — requerido/opcional]
¿Tiene configuración en sanity/desk/?: sí / no
¿Registrado en sanity/schemas/index.ts?: sí / no
```

### OBJETOS, ANOTACIONES, BLOQUES, TAXONOMÍAS
Para cada archivo en los subdirectorios de `sanity/schemas/objects/`,
`sanity/schemas/annotations/`, `sanity/schemas/blocks/`, `sanity/schemas/taxonomies/`:
```
Nombre del schema:
Tipo: object / annotation / block / taxonomy
¿Registrado en sanity/schemas/index.ts?: sí / no
Campos definidos: [nombre — tipo]
```

### VERIFICACIONES CRÍTICAS DEL TEMPLATE
Flagear inmediatamente estos problemas conocidos del template:
- `sanity/types/index.ts` tiene `export * from './documents'` comentado —
  los tipos de documento no se exportan, cualquier componente que los
  importe directamente debe ajustar su ruta de import
- `sanity/types/documents/index.ts` tiene `export * from './project'` comentado
- `sanity/types/singletons/legal.ts` e `information.ts` existen sin schemas
  correspondientes en `sanity/schemas/singletons/`
- `sanity/types/projects/` existe sin schemas correspondientes

### PARA CADA CAMPO EN CADA SCHEMA
- Nombre del campo
- Tipo
- ¿Marcado como requerido con validación?
- ¿Tiene título y descripción para los editores del Studio?
- ¿Es campo de imagen?: verificar si tiene sub-campo `alt` editable
- ¿Es campo de referencia?: ¿a qué schema apunta?

Guardar el inventario completo en:
`.claude/plans/auditoria-contenido/01-schema-inventory.md`

Flagear inmediatamente:
- Archivos de schema que existen pero no están registrados
- Schemas sin configuración de desk — los editores no pueden acceder
  en el Studio
- Campos requeridos sin mensaje de validación — los editores no reciben
  orientación cuando el campo está vacío

**Esperar aprobación antes de la Fase 2.**

---

## FASE 2: COHERENCIA SCHEMA VS QUERY

Cruzar cada campo de schema contra cada query GROQ.

Para cada campo en cada schema, leer cada archivo en `sanity/queries/`
y buscar referencias a ese nombre de campo en proyecciones GROQ.

### CAMPOS NO USADOS
Flagear cada campo de schema que no aparece en ninguna query GROQ:
```
Campo: nombre del campo
Schema: schema al que pertenece
¿Fue agregado recientemente y las queries aún no lo reflejan?
¿Es un campo legacy de una versión anterior del schema?
Severidad:
  Alto — campo de tipo documento nunca proyectado en ningún lugar,
         los editores lo rellenan pero nunca aparece en el sitio
  Advisory — sub-campo de objeto o portable text nunca proyectado,
              puede ser intencional
```

### CAMPOS FANTASMA
Flagear cada nombre de campo referenciado en una proyección GROQ
que no existe en el schema correspondiente:
```
Campo: nombre como está escrito en la query
Archivo de query y ubicación aproximada
Schema donde debería existir pero no existe
Severidad: siempre bloqueante — la query retornará null
           silenciosamente para este campo en cada documento
```

### VERIFICACIONES ESPECÍFICAS DEL TEMPLATE

**Primitivo `imageData`:**
Solo proyecta `"caption": caption`. Verificar que ningún componente
espera un campo `alt` de imágenes que pasen por este primitivo.
Si algún componente pasa `.alt` o `.caption` a LazyImage como alt text,
es un campo fantasma en potencia.

**Primitivo `imageSize`:**
Proyecta `ref`, `hotspot`, `crop` que no están en el tipo `Image`.
Flagear si algún componente accede a `.ref`, `.hotspot` o `.crop`
de una imagen — estos campos no están tipados.

**Fragment `body.ts`:**
Usa `...` spread en la proyección PortableText. Verificar que todos
los `_type` de módulo custom usados en el body tienen un case explícito
en el fragment. Módulos custom no manejados en el fragment
retornan todos sus campos, lo cual es over-fetching.

### PROFUNDIDAD DE PROYECCIÓN EN REFERENCIAS
Para campos de referencia proyectados con `->`:
- Verificar que los sub-campos proyectados existen en el schema referenciado
- Flagear cualquier sub-campo proyectado desde una referencia que
  no existe en el schema destino

### INCONSISTENCIAS EN ARRAYS
Para campos de array proyectados en queries:
- Verificar que el tipo de ítem del array coincide con lo que define el schema
- Flagear queries que usan proyección de objeto plano en un array
  que contiene tipos polimórficos con `_type`

Guardar todos los hallazgos en:
`.claude/plans/auditoria-contenido/02-schema-query-coherence.md`

**Esperar aprobación antes de la Fase 3.**

---

## FASE 3: COHERENCIA QUERY VS TIPO

Cruzar cada query GROQ contra cada tipo TypeScript.

Para cada archivo de query en `sanity/queries/`:
- Identificar el tipo TypeScript al que se asigna el resultado de la query
- Comparar cada campo proyectado contra la definición del tipo
- Flagear campos proyectados en la query que faltan en el tipo
- Flagear campos en el tipo que no están proyectados por la query
  y no están marcados como opcionales en el tipo

Para cada tipo en `sanity/types/`:
- Verificar que tiene un schema correspondiente en `sanity/schemas/`
- Flagear tipos definidos manualmente que duplican o entran en conflicto
  con lo que la proyección del schema produciría

### TIPOS STALE
Flagear tipos TypeScript que referencian campos que ya no existen en
el schema — son errores silenciosos de runtime esperando ocurrir.

### VERIFICACIONES ESPECÍFICAS DEL TEMPLATE

**Tipo `Image` vs primitivos:**
- `imageSize` proyecta `ref`, `hotspot`, `crop` que no están en el tipo `Image`
- Verificar si algún componente accede a estas propiedades no tipadas
- El tipo `Image` tiene `imageUrl`, `metadata`, `filename` — verificar
  que la proyección siempre los incluye

**Tipo `SEO` vs fragment:**
- `SEO` tiene `title: string` (requerido), `description: string` (requerido),
  `image?: Image` (opcional)
- El fragment seo proyecta `title`, `description`, `image{...}`
- El schema SEO valida `title` como requerido pero el tipo lo marca
  como `string` no `string | null` — verificar que siempre está presente

**Tipos huérfanos:**
- `LegalPageData` en `sanity/types/singletons/legal.ts` — sin schema
- `sanity/types/singletons/information.ts` — verificar contenido
- `sanity/types/projects/projects.ts` y `singleProject.ts` — sin schemas
- Flagear todos como tipos sin schema correspondiente

Guardar todos los hallazgos en:
`.claude/plans/auditoria-contenido/03-query-type-coherence.md`

**Esperar aprobación antes de la Fase 4.**

---

## FASE 4: AUDITORÍA DE CAMPOS SEO

Verificar la arquitectura de contenido SEO en todos los tipos de documento
que representan páginas públicas.

Identificar tipos de documento públicos verificando:
- Qué schemas tienen archivos de página correspondientes en `app/(frontend)/`
- Qué schemas se usan en llamadas a `generateMetadata`
- Qué schemas aparecen en la generación del sitemap en `app/(frontend)/sitemap.ts`

Para cada tipo de documento público:

### CAMPOS SEO EN EL SCHEMA
- ¿El schema tiene un objeto SEO dedicado usando el objeto `seo` del proyecto?
- ¿Los campos SEO son opcionales o requeridos?
- ¿Los campos SEO tienen descripciones útiles para los editores?
- ¿Hay validación de longitud en `seoTitle` y `seoDescription`?
  — El schema `seo.ts` del proyecto valida description con `max(150)` ⚠️
  pero title solo como `required` sin límite de caracteres
- ¿El campo `seo.image` tiene `hotspot: true`?
  — El schema `seo.ts` del proyecto ya lo incluye ✓

### CAMPOS SEO EN QUERIES
- ¿La query GROQ para esta página proyecta los campos SEO?
- ¿La proyección incluye `seo{ ${seo} }` usando el fragment del proyecto?
- ¿Los datos SEO se pasan a `generateMetadata` o `seoHelper.ts`?

### CAMPOS SEO EN EL DESK DE STUDIO
- ¿Los campos SEO están en su propio grupo colapsable en el Studio?
  — El objeto `seo` del proyecto usa `group: 'seo'` y `collapsible: true` ✓
  — Verificar que el schema del documento define el grupo `seo` correctamente

### COBERTURA SEO FALTANTE
Para cada schema público sin campos SEO:
- Flagear como alto — estas páginas no tendrán metadata al ir a producción
  salvo que esté hardcodeada

Guardar todos los hallazgos en:
`.claude/plans/auditoria-contenido/04-seo-fields-audit.md`

**Esperar aprobación antes de la Fase 5.**

---

## FASE 5: AUDITORÍA DE ALT TEXT EN IMÁGENES

Encontrar cada campo de imagen en todos los schemas y verificar que
el alt text es editable por los editores de contenido.

Para cada campo de imagen en cada schema:
- ¿Hay un campo `alt` definido como campo string dentro del objeto imagen?
  Patrón correcto:
  ```typescript
  defineField({ name: 'image', type: 'image',
    fields: [defineField({ name: 'alt', type: 'string',
      description: 'Texto alternativo para accesibilidad y SEO' })]
  })
  ```
- ¿El campo `alt` está marcado como requerido con validación?
- ¿El campo `alt` tiene descripción explicando qué es un buen alt text?
- ¿El campo `alt` está proyectado en la query GROQ?
- ¿El valor `alt` se pasa a `LazyImage` en el componente que renderiza esta imagen?

### BRECHA CRÍTICA DEL TEMPLATE
El primitivo `imageData` solo proyecta `"caption": caption`.
**No existe proyección de `alt` en ningún primitivo del template.**
- Flagear todos los campos de imagen que pasan por `imageData` / `imageSize`
  sin proyectar `alt`
- Flagear si algún componente pasa `.caption` como alt text a LazyImage
  (caption y alt text son conceptos distintos)
- Este es un alto por defecto para todas las imágenes del template
  hasta que se agregue `alt` al primitivo `imageData`

### DETECCIÓN DE IMÁGENES DECORATIVAS
Flagear campos de imagen donde el contexto del schema sugiere que la imagen
es puramente decorativa — fondo, textura, patrón — y donde un `alt` vacío
o un marcador decorativo explícito sería más apropiado que alt requerido.

### COBERTURA DE ALT FALTANTE
Para cada campo de imagen sin sub-campo `alt`:
- Alto si la imagen es contenido (productos, personas, editorial)
- Advisory si la imagen es decorativa o puramente atmosférica

Guardar todos los hallazgos en:
`.claude/plans/auditoria-contenido/05-image-alt-audit.md`

**Esperar aprobación antes de la Fase 6.**

---

## FASE 6: BRECHAS DE CALIDAD DE CONTENIDO

Identificar patrones de diseño de schema que causarán problemas
editoriales o de producción.

### BRECHAS EN LA EXPERIENCIA DEL EDITOR
- Campos sin `title` — los editores ven el nombre técnico
- Campos sin `description` — los editores no saben qué escribir
- Campos requeridos sin mensaje de validación — sin orientación
- Campos de imagen sin `hotspot: true` — importante para recorte responsive
- Campos de portable text sin estilos de bloque definidos —
  los editores solo ven "Normal"
- Campos de slug sin `source` definido — los editores deben escribir
  el slug manualmente en vez de generarlo automáticamente

### BRECHAS DE GOBERNANZA DE CONTENIDO
- Tipos de documento sin configuración de `preview` en el schema —
  los editores no pueden identificar documentos en la vista de lista
- Tipos de documento sin `orderings` definidos donde el orden importa
- Tipos de documento singleton no reforzados como singletons en el desk —
  los editores pueden crear duplicados
- Campos de referencia sin `filter` — los editores pueden referenciar
  cualquier documento de ese tipo incluyendo borradores y no publicados

### BRECHAS EN PORTABLETEXT
Para cada campo portableText o blockContent:
- ¿Todas las marks custom definidas en el schema tienen un handler
  en el componente renderer de PortableText?
- ¿Todos los tipos de bloque custom definidos en el schema tienen
  un handler en el renderer?
- ¿El fragment `body.ts` del proyecto maneja todos los tipos `_type`
  de módulo que el schema `body.tsx` define?
  — Verificar que los `_type == 'module.X'` en `body.ts` coincidan
  con los types definidos en `sanity/schemas/blocks/body.tsx`
- Flagear cualquier mark o tipo de bloque definido en el schema pero
  sin renderer — causará warning en consola o fallo silencioso de render

Guardar todos los hallazgos en:
`.claude/plans/auditoria-contenido/06-content-quality-gaps.md`

**Esperar aprobación antes de la Fase 7.**

---

## FASE 7: REPORTE CONSOLIDADO DE AUDITORÍA

Unificar todos los hallazgos de las Fases 1 a 6 en un único reporte
priorizado.

### RESUMEN DE AUDITORÍA
```
Schemas auditados: N total
  Documentos: N | Singletons: N | Objetos: N | Otros: N
Queries auditadas: N total
Tipos auditados: N total

ISSUES POR CATEGORÍA:
Schema vs Query:    X bloqueantes, X altos, X advisory
Query vs Tipos:     X bloqueantes, X altos, X advisory
Campos SEO:         X altos, X advisory
Alt text imágenes:  X altos, X advisory
Calidad contenido:  X altos, X advisory

SALUD DE LA ARQUITECTURA DE CONTENIDO:
✅ Saludable:        sin issues bloqueantes ni altos
⚠️ Necesita atención: issues altos presentes
🚫 Brechas críticas:  issues bloqueantes presentes
```

### ISSUES BLOQUEANTES
Campos referenciados en queries que no existen en el schema.
Retornan `null` silenciosamente en producción ahora mismo.
Para cada uno: schema, archivo de query, nombre de campo, corrección recomendada.

### ISSUES ALTOS
- Campos de schema no usados (editores rellenan datos que nunca aparecen)
- Schemas públicos sin campos SEO
- Campos de imagen sin alt text editable
- Brecha del primitivo `imageData` sin proyección de `alt`
Para cada uno: schema, campo, corrección recomendada.

### ISSUES ADVISORY
- Brechas de experiencia del editor
- Brechas de gobernanza de contenido
- Brechas de cobertura PortableText
Agrupados por categoría.

### MATRIX DE SALUD DE SCHEMAS

| Schema | Registrado | Desk | SEO | Campos proyectados | Alt editable | Preview |
|--------|-----------|------|-----|-------------------|-------------|---------|
| [nombre] | sí/no | sí/no | sí/no/n-a | sí/parcial/no | sí/no/n-a | sí/no |

La matriz es obligatoria — da al desarrollador el panorama completo de un vistazo.

Guardar el reporte consolidado en:
`.claude/plans/auditoria-contenido/07-consolidated-report.md`

---

## REGLAS DEL AGENTE

- **Nunca modificar schemas, queries, tipos ni componentes**
- **Nunca asumir que un campo no se usa sin revisar todos los archivos
  de query** — un campo usado en una query no está sin usar
- **Nunca flagear campos en schemas de objeto como no usados si el
  objeto mismo está proyectado** — la proyección del padre incluye
  todos los campos del objeto
- **La matrix de salud de schemas es obligatoria** — da al desarrollador
  el panorama completo de un vistazo
- Si un archivo de schema no está registrado en config, flagear antes
  de auditar sus campos — schemas no registrados son invisibles
  para todo lo demás
- La brecha del primitivo `imageData` sin `alt` afecta a todas las
  imágenes del proyecto — reportar como un único issue alto sistémico,
  no como un issue por cada imagen
