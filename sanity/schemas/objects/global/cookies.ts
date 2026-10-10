import { defineField } from 'sanity'

export default defineField({
  name: 'cookieSettings',
  title: 'Cookie banner',
  type: 'object',
  options: {
    collapsed: false,
    collapsible: true,
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'privacyTitle',
      title: 'Privacy title',
      type: 'string',
    }),
    defineField({
      name: 'privacyText',
      title: 'Privacy text',
      description: 'Shown before the link to the privacy policy.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'privacyLinkLabel',
      title: 'Privacy link label',
      type: 'string',
    }),
    defineField({
      name: 'privacyLinkUrl',
      title: 'Privacy link URL',
      description: 'e.g. /legals/privacy-policy',
      type: 'string',
    }),
    defineField({
      name: 'acceptAllLabel',
      title: 'Accept all button',
      type: 'string',
    }),
    defineField({
      name: 'acceptEssentialLabel',
      title: 'Essential only button',
      type: 'string',
    }),
  ],
})
