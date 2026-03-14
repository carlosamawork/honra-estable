import type { MetadataRoute } from 'next'
import { getProductHandles } from '@/sanity/queries/queries/product'
import { buildUrl } from '@/utils/seoHelper'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const handles = await getProductHandles()

  const productUrls: MetadataRoute.Sitemap = handles.map(({ handle }) => ({
    url: buildUrl(`/products/${handle}`),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: buildUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: buildUrl('/shop'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: buildUrl('/about'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...productUrls,
  ]
}
