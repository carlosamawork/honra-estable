import { notFound } from 'next/navigation'
import type { Viewport } from 'next'
import { getExplorePage, getExplorePageSlugs } from '@/sanity/queries/queries/explore'
import { ExplorePage } from '@/components/ExplorePage'
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

export const revalidate = 300

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getExplorePageSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const data = await getExplorePage(slug)

  if (!data) return {}

  const seo = data?.seo
  const title = seo?.title ? `${seo.title} — ${siteTitle}` : `${data.title} — ${siteTitle}`
  const description = seo?.description || siteDescription
  const imageUrl = seo?.image?.imageUrl || BASE_IMAGE_URL
  const imageWidth = seo?.image?.metadata?.dimensions?.width || BASE_IMAGE_WIDTH
  const imageHeight = seo?.image?.metadata?.dimensions?.height || BASE_IMAGE_HEIGHT
  const canonical = buildUrl(`/explore/${slug}`)

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
      type: 'article',
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

export default async function ExploreRoute({ params }: Props) {
  const { slug } = await params
  const data = await getExplorePage(slug)

  if (!data) notFound()

  return <ExplorePage data={data} />
}
