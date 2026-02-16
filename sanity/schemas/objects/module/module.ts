import { defineField } from 'sanity'

import blocksToText from '../../../utils/blocksToText'

export default defineField({
  name: 'module.page',
  title: 'Module',
  type: 'object',
  fields: [
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: {
        list: [
          { title: '1', value: 1 },
          { title: '2', value: 2 },
          { title: '3', value: 3 },
          { title: '4', value: 4 },
          { title: '5', value: 5 },
          { title: '6', value: 6 },
          { title: '7', value: 7 },
          { title: '8', value: 8 },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'height',
      title: 'Height',
      type: 'string',
      options: {
        list: [
          { title: 'Auto', value: 'auto' },
          { title: 'Medium', value: 'medium' },
          { title: 'Full', value: 'full' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
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
            // Image
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alternative text',
                  type: 'string',
                }),
                defineField({
                  name: 'caption',
                  title: 'Caption',
                  type: 'string',
                })
              ],
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
        },
        {
          name: 'productItem',
          title: 'Product item',
          type: 'reference',
          to: [{ type: 'product' }],
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
      const image = item?.image || item?.store?.previewImageUrl
      const body = item?.body || undefined 
      const title = item?.store?.title || undefined

      return {
        media: image,
        subtitle: body && blocksToText(body),
        title: title || 'Module item',
      }
    },
  },
})
