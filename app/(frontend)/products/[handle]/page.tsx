import { notFound } from 'next/navigation'
import type { Viewport } from 'next'
import { getProduct, getProductHandles, getProductSEO } from '@/sanity/queries/queries/product'
import { getProductStorefrontData } from '@/lib/shopify'
import {
  ProductPage,
  type ShopifyColorValue,
  type VariantGalleries,
  type VariantGalleryImage,
} from '@/components/ProductPage'
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

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateStaticParams() {
  const handles = await getProductHandles()
  return handles.map(({ handle }) => ({ handle }))
}

export async function generateMetadata({ params }: Props) {
  const { handle } = await params
  const page = await getProductSEO(handle)

  if (!page) {
    return {
      metadataBase: BASE_URL,
      title: siteTitle,
      description: siteDescription,
      robots: { index: false, follow: true },
    }
  }

  const title = page.seo?.title || page.title || siteTitle
  const description = page.seo?.description || siteDescription
  const imageUrl = page.seo?.image?.imageUrl || page.previewImage || BASE_IMAGE_URL
  const imageWidth = page.seo?.image?.metadata?.dimensions?.width || BASE_IMAGE_WIDTH
  const imageHeight = page.seo?.image?.metadata?.dimensions?.height || BASE_IMAGE_HEIGHT
  const canonical = buildUrl(`/products/${handle}`)

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
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
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

export default async function ProductDetailPage({ params }: Props) {
  const { handle } = await params
  const [product, storefrontData] = await Promise.all([
    getProduct(handle),
    getProductStorefrontData(handle) as Promise<{
      galleries: VariantGalleries
      productImages: VariantGalleryImage[]
      colorValues: ShopifyColorValue[]
    }>,
  ])

  if (!product) notFound()

  return (
    <ProductPage
      product={product}
      variantGalleries={storefrontData.galleries}
      productImages={storefrontData.productImages}
      shopifyColorValues={storefrontData.colorValues}
    />
  )
}
