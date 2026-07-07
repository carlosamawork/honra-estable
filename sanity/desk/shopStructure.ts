import {StructureBuilder} from 'sanity/structure'

export default (S: StructureBuilder) =>
  S.listItem()
    .title('Shop')
    .schemaType('shop')
    .child(S.editor().title('Shop').schemaType('shop').documentId('shop'))
