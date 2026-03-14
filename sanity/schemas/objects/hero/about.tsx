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
      title: 'Texto de arriba',
      type: 'bodySimple',
    }),
    defineField({
      name: 'textDown',
      title: 'Texto de abajo',
      type: 'bodySimple',
    }),
  ],
})
