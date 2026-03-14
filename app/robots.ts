import type { MetadataRoute } from 'next'
import { BASE_URL, buildUrl } from '@/utils/seoHelper'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/'],
      },
    ],
    sitemap: buildUrl('/sitemap.xml'),
    host: BASE_URL.origin,
  }
}
