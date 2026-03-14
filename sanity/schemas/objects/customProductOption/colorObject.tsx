import React from 'react'
import {defineField} from 'sanity'

const ColorPreview = ({color}: {color: string}) => (
  <div
    style={{
      backgroundColor: color,
      borderRadius: 'inherit',
      height: '100%',
      width: '100%',
    }}
  />
)

export default defineField({
  name: 'customProductOption.colorObject',
  title: 'Color',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Shopify product option value (case sensitive)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'color',
      title: 'Color (hex)',
      type: 'string',
      description: 'Hex color, e.g. #E87040',
      validation: (Rule) =>
        Rule.required().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
          name: 'hex',
          invert: false,
        }),
    }),
  ],
  preview: {
    select: {
      color: 'color',
      title: 'title',
    },
    prepare(selection) {
      const {color, title} = selection
      return {
        media: color ? <ColorPreview color={color} /> : undefined,
        subtitle: color,
        title,
      }
    },
  },
})
