// sanity/queries/common/settings.ts
import { groq } from 'next-sanity'
import { client } from '../index'
import type { SettingsData } from '@/sanity/types'
import { seo } from '../fragments/seo'

export async function getSettings(): Promise<SettingsData> {
  return client.fetch(
    groq`*[_type == "settings"][0]{
      "headerMenu": menu{
        "links": links[]{
          _type,
          title,
          url,
          newWindow
        }
      },
      "footerMenu": {
        "links": footer.footerLinks[]{
          _type,
          title,
          url,
          newWindow
        }
      },
      "footerSecondaryMenu": {
        "links": footer.footerLinksSecondary[]{
          _type,
          title,
          url,
          newWindow
        }
      },
      "claim": footer.claim,
      "copyright": footer.copyright,
      seo{
        ${seo}
      }
    }`,
    {},
    {
      next: {
        tags: ['settings'], // ISR tag
        revalidate: 60,     // revalidate every 60s
      },
    }
  )
}
