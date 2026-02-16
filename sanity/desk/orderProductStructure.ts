import {ListItemBuilder} from 'sanity/desk'
import defineStructure from '../utils/defineStructure'
import {DocumentsIcon} from '@sanity/icons'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'


export default defineStructure((S, context) =>
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
);