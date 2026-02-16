import {LinkIcon} from '@sanity/icons'
import {defineField} from 'sanity'

import {PAGE_REFERENCES} from '../../../constants'

export default defineField({
  title: 'Internal Link',
  name: 'linkInternal',
  type: 'object',
  icon: LinkIcon,
  fields: [
    // Title
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    // Reference
    {
      name: 'reference',
      type: 'reference',
      weak: true,
      validation: (Rule) => Rule.required(),
      to: PAGE_REFERENCES,
    },
  ],
  preview: {
    select: {
      reference: 'reference',
      referenceTitle: 'reference.title',
      title: 'title',
    },
    prepare(selection) {
      const {
        reference,
        referenceTitle,
        title,
      } = selection

      let subtitle = []
      if (reference) {
        subtitle.push([`→ ${referenceTitle || reference?._id}`])
        
      } else {
        subtitle.push('(Nonexistent document reference)')
      }

      return {
        // media: image,
        subtitle: subtitle.join(' '),
        title,
      }
    },
  },
})
