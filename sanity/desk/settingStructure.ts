import { StructureBuilder } from 'sanity/structure'

export default function settingsStructure(S: StructureBuilder, context: any) {
  return S.listItem()
    .title('Settings')
    .schemaType('settings')
    .child(
      S.editor()
        .title('Settings')
        .schemaType('settings')
        .documentId('settings')
    )
}
