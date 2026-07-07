import { cache } from 'react'
import type { Viewport } from 'next'
import { getShopModules, getShopProducts } from '@/sanity/queries/queries/shop'
import { getDefaultSEO } from '@/sanity/queries/common/defaultSEO'
import { ShopPage } from '@/components/ShopPage'
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

export const revalidate = 60

const getDefaultSEOCached = cache(getDefaultSEO)

export async function generateMetadata() {
  const defaultSEO = await getDefaultSEOCached()

  const title = defaultSEO?.title ? `Shop — ${siteTitle}` : `Shop — ${siteTitle}`
  const description = defaultSEO?.description || siteDescription
  const imageUrl = defaultSEO?.image?.imageUrl || BASE_IMAGE_URL
  const imageWidth = defaultSEO?.image?.metadata?.dimensions?.width || BASE_IMAGE_WIDTH
  const imageHeight = defaultSEO?.image?.metadata?.dimensions?.height || BASE_IMAGE_HEIGHT
  const canonical = buildUrl('/shop')

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

export default async function Shop() {
  const [products, modules] = await Promise.all([getShopProducts(), getShopModules()])

  return <ShopPage products={products} modules={modules} />
}
