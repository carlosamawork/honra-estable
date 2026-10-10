import { defineField } from 'sanity'

export default defineField({
  name: 'brandSettings',
  title: 'Brand',
  type: 'object',
  options: {
    collapsed: false,
    collapsible: true,
  },
  fields: [
    defineField({
      name: 'logo',
      title: 'Header logo',
      description: 'Shown top-left on every page. SVG or PNG with transparent background.',
      type: 'image',
      options: { hotspot: false },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'logoFooter',
      title: 'Footer logo',
      description: 'Symbol shown in the footer (desktop and mobile).',
      type: 'image',
      options: { hotspot: false },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'socialHandle',
      title: 'Social handle',
      description: 'Shown in the mobile footer, e.g. @honra.world',
      type: 'string',
    }),
    defineField({
      name: 'socialUrl',
      title: 'Social URL',
      description: 'Where the social handle links to.',
      type: 'url',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      description: 'Shown in the mobile footer.',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
  ],
})
