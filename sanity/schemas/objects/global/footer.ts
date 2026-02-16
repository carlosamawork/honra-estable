import { defineField } from 'sanity'

export default defineField({
  name: 'footerSettings',
  title: 'Footer',
  type: 'object',
  options: {
    collapsed: false,
    collapsible: true,
  },
  fields: [
    // Links
    defineField({
      name: 'footerLinks',
      title: 'Footer Links',
      type: 'menuLinks',
    })
  ],
})
