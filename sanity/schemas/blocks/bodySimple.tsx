import { defineField } from 'sanity'

export default defineField({
  name: 'bodySimple',
  title: 'Body AMA',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal/Paragraph', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
      ],
      marks: {
        decorators: [
        ],
        annotations: [
          { name: 'annotationLinkEmail', type: 'annotationLinkEmail', },
          { name: 'annotationLinkExternal', type: 'annotationLinkExternal' },
        ],
      },
    },
  ],
})
