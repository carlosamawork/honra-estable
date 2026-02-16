import { defineField, defineType } from 'sanity'

// Install lucide.dev icons with "npm install lucide-react"
import { TagIcon } from '@sanity/icons'

export default defineType({
  name: 'category',
  title: 'Categories',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({ name: 'title', type: 'string' }),

    defineField({
      name: 'orderRank',
      type: 'string',
      hidden: true,
    }),
  ],
  // Customize the preview so parents are visualized in the studio
  preview: {
    select: {
      title: 'title',
    },
    prepare: ({ title }) => ({
      title,
    }),
  },
})