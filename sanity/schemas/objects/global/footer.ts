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
    }),
    defineField({
      name: 'footerLinksSecondary',
      title: 'Footer Links',
      type: 'menuLinks',
    }),
    defineField({
      name: 'claim',
      title: 'Claim',
      type: 'string',
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright',
      type: 'string',
    })
  ],
})
