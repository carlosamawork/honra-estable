import {DocumentsIcon} from '@sanity/icons'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {ListItemBuilder, StructureBuilder, StructureContext} from 'sanity/structure'

export default (S: StructureBuilder, context: StructureContext) =>
  S.listItem()
    .title('Ordenar Productos')
    .icon(DocumentsIcon)
    .child(async (id) =>
        S.list()
        .title('Post')
        .items([
            orderableDocumentListDeskItem({type: 'product', S, context}),
        ])
    )
