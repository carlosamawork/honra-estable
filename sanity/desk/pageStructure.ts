import {ListItemBuilder, StructureBuilder} from 'sanity/structure'
import defineStructure from '../utils/defineStructure'
import {DocumentsIcon} from '@sanity/icons'

export default (S: StructureBuilder) =>
  S.listItem()
    .title('Pages')
    .icon(DocumentsIcon)
    .schemaType('page')
    .child(S.documentTypeList('page'))

