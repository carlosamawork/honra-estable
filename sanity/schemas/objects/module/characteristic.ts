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
              validation: (Rule) => Rule.required(),
            }),
            // Body
            defineField({
              name: 'body',
              title: 'Body',
              type: 'array',
              of: [{
                type: 'bodySimple',
              }],
              validation: (Rule) => Rule.required(),
            }),
          ]
        }
      ],
      validation: (Rule) => Rule.required().min(1),
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
