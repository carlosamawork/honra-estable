import {ListItemBuilder, StructureBuilder} from 'sanity/structure'
import defineStructure from '../utils/defineStructure'

export default (S: StructureBuilder) =>
  S.listItem()
    .title('Home')
    .schemaType('home')
    .child(S.editor().title('Home').schemaType('home').documentId('home'))

