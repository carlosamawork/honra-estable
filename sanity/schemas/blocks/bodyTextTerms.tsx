import { defineField } from 'sanity'

export default defineField({
  name: 'bodyTextTerms',
  title: 'Body — p, H3',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal/Paragraph', value: 'normal' },
        { title: 'Medium', value: 'h3' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
      ],
      marks: {
        decorators: [
          { title: 'Emphasis', value: 'em' },
          { title: 'Bold', value: 'strong' },
        ],
        annotations: [
          { name: 'annotationLinkEmail', type: 'annotationLinkEmail', },
          { name: 'annotationLinkExternal', type: 'annotationLinkExternal' },
        ],
      },
    },
  ],
})
