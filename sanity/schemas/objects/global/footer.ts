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
    defineField({
      name: 'footerLinks',
      title: 'Primary links',
      description: 'First column (Shop, About, Explore...). Max 5.',
      type: 'menuLinks',
    }),
    defineField({
      name: 'footerLinksSecondary',
      title: 'Legal links',
      description: 'Second column (Contact, Terms, Privacy...). Max 5.',
      type: 'menuLinks',
    }),
    defineField({
      name: 'claim',
      title: 'Claim',
      description: 'Short brand statement shown in the footer.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'copyright',
      title: 'Legal line',
      description: 'Company details and copyright, shown at the bottom.',
      type: 'text',
      rows: 3,
    }),
  ],
})
