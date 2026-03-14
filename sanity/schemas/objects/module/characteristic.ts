import { defineField } from 'sanity'
import {BlockContentIcon} from '@sanity/icons'

import blocksToText from '../../../utils/blocksToText'

export default defineField({
  name: 'characteristic',
  title: 'Module',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          name: 'customItem',
          title: 'Custom item',
          type: 'object',
          fields: [
            defineField({
                name: 'title',
                title: 'Title',
                type: 'string',
            }),
            // Image
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            }),
            // Body
            defineField({
              name: 'body',
              title: 'Body',
              type: 'bodySimple',
            }),
          ]
        }
      ],
    }),   
  ],
  preview: {
    select: {
      item: 'items.0',
    },
    prepare(selection) {
      const { item } = selection
      const body = item?.body || undefined 
      const title = item?.store?.title || undefined

      return {
        media: BlockContentIcon,
        subtitle: body && blocksToText(body),
        title: title || 'Characteristic item',
      }
    },
  },
})
