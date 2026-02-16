import {ListItemBuilder, StructureBuilder} from 'sanity/structure'
import defineStructure from '../utils/defineStructure'

export default (S: StructureBuilder) =>
  S.listItem().title('Collections').schemaType('collection').child(S.documentTypeList('collection'))

