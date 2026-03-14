import {ListItemBuilder, StructureBuilder} from 'sanity/structure'
import defineStructure from '../utils/defineStructure'

export default (S: StructureBuilder) =>
  S.listItem()
    .title('About')
    .schemaType('about')
    .child(S.editor().title('About').schemaType('about').documentId('about'))

