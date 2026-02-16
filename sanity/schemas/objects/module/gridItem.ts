import { defineField } from 'sanity'

import blocksToText from '../../../utils/blocksToText'

export default defineField({
  name: 'gridItem',
  title: 'Item',
  type: 'object',
  fields: [
    // Title
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
  ],
  preview: {
    select: {
      body: 'body',
      image: 'image',
      title: 'title',
    },
    prepare(selection) {
      const { body, image, title } = selection
      return {
        media: image,
        subtitle: body && blocksToText(body),
        title,
      }
    },
  },
})
