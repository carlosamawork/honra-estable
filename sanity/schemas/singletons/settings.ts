import { CogIcon } from '@sanity/icons'
import { defineType, defineField } from 'sanity'

const TITLE = 'Settings'
interface ProductOptions {
  title: string
}

export default defineType({
  name: 'settings',
  title: TITLE,
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      default: true,
      name: 'header',
      title: 'Header',
    },
    {
      name: 'footer',
      title: 'Footer',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    // Menu
    defineField({
      name: 'header',
      title: 'Header',
      type: 'headerSettings',
      group: 'header',
    }),
    // Footer
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'footerSettings',
      group: 'footer',
    }),
    // // Not found page
    // defineField({
    //   name: 'notFoundPage',
    //   title: '404 page',
    //   type: 'notFoundPage',
    //   group: 'notFoundPage',
    //   hidden: true
    // }),
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: TITLE,
      }
    },
  },
})
