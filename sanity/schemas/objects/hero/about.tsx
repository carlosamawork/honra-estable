import {defineField} from 'sanity'

export default defineField({
  name: 'hero.about',
  title: 'About hero',
  type: 'object',
  fields: [
    // Title
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'textUp',
      title: 'Text above',
      type: 'bodySimple',
    }),
    defineField({
      name: 'textDown',
      title: 'Text below',
      type: 'bodySimple',
    }),
  ],
})
