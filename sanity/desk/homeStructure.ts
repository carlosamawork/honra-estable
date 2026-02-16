import { StructureBuilder } from 'sanity/structure'

export default function home(S: StructureBuilder, context: any) {
  return S.listItem()
    .title('Home')
    .schemaType('home')
    .child(
      S.editor()
        .title('Home')
        .schemaType('home')
        .documentId('home')
    )
}
