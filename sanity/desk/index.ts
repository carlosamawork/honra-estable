/**
 * Desk structure overrides (Sanity v3.99.x)
 */

import { StructureBuilder } from 'sanity/structure'
import home from './homeStructure'
import pages from './pageStructure'
import settings from './settingStructure'
import category from './categoryStructure'

/**
 * Prevent duplicates of manually added document types in the root pane.
 */
const hiddenDocTypes = (S: StructureBuilder) => (listItem: any) => {
  const id = listItem.getId?.()
  if (!id) return false

  return ![
    'collection',
    'colorTheme',
    'home',
    'media.tag',
    'page',
    'product',
    'productVariant',
    'settings',
    'posts',
    'category',
    'postTag',
    'orderPosts',
    'orderProducts',
  ].includes(id)
}

/**
 * Main desk structure
 */
export const structure = (S: StructureBuilder, context?: any) => {
  return S.list()
    .title('Content')
    .items([
      home(S, context),
      S.divider(),
      pages(S, context),
      S.divider(),
      category(S, context),
      S.divider(),
      settings(S, context),
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes(S)),
    ])
}
