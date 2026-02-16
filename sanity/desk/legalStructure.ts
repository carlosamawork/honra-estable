import {ListItemBuilder, StructureBuilder} from 'sanity/structure'
import defineStructure from '../utils/defineStructure'
import {DocumentsIcon} from '@sanity/icons'

export default (S: StructureBuilder) =>
  S.listItem()
    .title('Legals')
    .icon(DocumentsIcon)
    .schemaType('legal')
    .child(S.documentTypeList('legal'))

