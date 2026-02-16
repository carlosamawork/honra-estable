import {ListItemBuilder, StructureBuilder} from 'sanity/structure'


export default (S: StructureBuilder) =>
  S.listItem()
    .title('Settings')
    .schemaType('settings')
    .child(S.editor().title('Settings').schemaType('settings').documentId('settings'))

