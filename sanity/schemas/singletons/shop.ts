import {BasketIcon} from '@sanity/icons'
import {defineField} from 'sanity'

const TITLE = 'Shop'

export default defineField({
  name: 'shop',
  title: TITLE,
  type: 'document',
  icon: BasketIcon,
  groups: [
    {
      default: true,
      name: 'editorial',
      title: 'Editorial',
    },
  ],
  fields: [
    defineField({
      name: 'modules',
      title: 'Modules',
      description: 'Content shown after the product grid (e.g. campaign images)',
      type: 'array',
      of: [
        {
          type: 'module.page',
        },
      ],
      group: 'editorial',
    }),
  ],
  preview: {
    prepare() {
      return {
        subtitle: 'Shop',
        title: TITLE,
      }
    },
  },
})
