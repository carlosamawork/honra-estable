import {ListItemBuilder} from 'sanity/desk'
import defineStructure from '../utils/defineStructure'
import {DocumentsIcon} from '@sanity/icons'

export default defineStructure((S) =>
  S.listItem()
    .title('Legals')
    .icon(DocumentsIcon)
    .schemaType('legal')
    .child(S.documentTypeList('legal'))
)
