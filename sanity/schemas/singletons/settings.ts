import {CogIcon} from '@sanity/icons'
import {defineType, defineField} from 'sanity'

const TITLE = 'Settings'

export default defineType({
  name: 'settings',
  title: TITLE,
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      default: true,
      name: 'navigation',
      title: 'Navigation',
    },
    {
      name: 'brand',
      title: 'Brand',
    },
    {
      name: 'labels',
      title: 'Labels',
    },
    {
      name: 'cookies',
      title: 'Cookies',
    },
    {
      name: 'notFoundPage',
      title: '404 page',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    // Menu
    defineField({
      name: 'menu',
      title: 'Header menu',
      description: 'Links shown in the header. Desktop shows the first 3, mobile shows all.',
      type: 'menuSettings',
      group: 'navigation',
    }),
    // Footer
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'footerSettings',
      group: 'navigation',
    }),
    // Brand
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'brandSettings',
      group: 'brand',
    }),
    // Labels
    defineField({
      name: 'labels',
      title: 'Interface labels',
      description: 'Button texts and short messages used across the site.',
      type: 'labelSettings',
      group: 'labels',
    }),
    // Cookies
    defineField({
      name: 'cookies',
      title: 'Cookie banner',
      type: 'cookieSettings',
      group: 'cookies',
    }),
    // Not found page
    defineField({
      name: 'notFoundPage',
      title: '404 page',
      type: 'notFoundPage',
      group: 'notFoundPage',
    }),
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
