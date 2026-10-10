import {ListItemBuilder, StructureBuilder} from 'sanity/structure'
import defineStructure from '../utils/defineStructure'
import {TagsIcon} from '@sanity/icons'

export default (S: StructureBuilder) =>
  S.listItem()
    .title('Categories')
    .icon(TagsIcon)
    .schemaType('category')
    .child(S.documentTypeList('category'))
