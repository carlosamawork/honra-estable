// sanity/structure/categoryStructure.ts
import { StructureBuilder } from 'sanity/structure'
import { TagsIcon } from '@sanity/icons'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'

export default function categoryStructure(S: StructureBuilder, context: any) {
  return S.listItem()
    .title('Categories')
    .icon(TagsIcon)
    .child(() =>
      S.list()
        .title('Categories')
        .items([
          orderableDocumentListDeskItem({ type: 'category', S, context, title: 'Categories' }),
        ])
    )
}