import { DocumentsIcon } from '@sanity/icons'
import { StructureBuilder } from 'sanity/structure'

export default function pageStructure(S: StructureBuilder, context: any) {
  return S.listItem()
    .title('Other Pages')
    .icon(DocumentsIcon)
    .schemaType('page')
    .child(S.documentTypeList('page'))
}
