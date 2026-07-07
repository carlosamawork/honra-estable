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
          name: 'imageItem',
          title: 'Image item',
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
            
          ],
          preview: {
            select: {
              image: 'image',
              caption: 'image.caption',
              alt: 'image.alt',
            },
            prepare(selection) {
              const { image, caption, alt } = selection
              return {
                media: image,
                title: caption || alt || 'Image item',
                subtitle: 'Image',
              }
            },
          },
        },
        {
          name: 'textItem',
          title: 'Text item',
          type: 'object',
          fields: [
            // Body
            defineField({
              name: 'body',
              title: 'Body',
              type: 'bodySimple',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              body: 'body',
            },
            prepare(selection) {
              const { body } = selection
              const text = body ? blocksToText(body) : ''
              return {
                title: text || 'Text item',
                subtitle: 'Text',
              }
            },
          },
        },
        {
          name: 'productItem',
          title: 'Product item',
          type: 'productWithVariant',
        }
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    
  ],
  preview: {
    select: {
      columns: 'columns',
      height: 'height',
      firstItem: 'items.0',
      item0: 'items.0._key',
      item1: 'items.1._key',
      item2: 'items.2._key',
    },
    prepare(selection) {
      const { columns, height, firstItem, item0, item1, item2 } = selection
      const countLabel = item2
        ? '3+ items'
        : item1
          ? '2 items'
          : item0
            ? '1 item'
            : '0 items'
      const image = firstItem?.image || firstItem?.store?.previewImageUrl
      const body = firstItem?.body
      const bodyText = body ? blocksToText(body) : ''
      const firstTitle =
        firstItem?.store?.title ||
        firstItem?.image?.caption ||
        firstItem?.image?.alt ||
        bodyText ||
        'Module item'

      return {
        media: image,
        title: firstTitle,
        subtitle: `${columns || 1} col · ${height || 'auto'} · ${countLabel}`,
      }
    },
  },
})
