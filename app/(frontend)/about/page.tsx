import type { Viewport } from 'next'
import { getAbout } from '@/sanity/queries/queries/about'
import { AboutPage } from '@/components/AboutPage'
import {
  BASE_IMAGE_HEIGHT,
  BASE_IMAGE_URL,
  BASE_IMAGE_WIDTH,
  BASE_URL,
  buildUrl,
  getFavicons,
  siteDescription,
  siteTitle,
} from '@/utils/seoHelper'

export const revalidate = 3600

export async function generateMetadata() {
  const data = await getAbout()
  const seo = data?.seo

  const title = seo?.title ? `${seo.title} — ${siteTitle}` : `About — ${siteTitle}`
  const description = seo?.description || siteDescription
  const imageUrl = seo?.image?.imageUrl || BASE_IMAGE_URL
  const imageWidth = seo?.image?.metadata?.dimensions?.width || BASE_IMAGE_WIDTH
  const imageHeight = seo?.image?.metadata?.dimensions?.height || BASE_IMAGE_HEIGHT
  const canonical = buildUrl('/about')

  return {
    metadataBase: BASE_URL,
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteTitle,
      images: [{ url: imageUrl, width: imageWidth, height: imageHeight }],
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    },
    icons: getFavicons(),
    alternates: { canonical },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default async function AboutRoute() {
  const data = await getAbout()

  return <AboutPage data={data} />
}
