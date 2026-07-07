import { notFound } from 'next/navigation'
import type { Viewport } from 'next'
import { getLegalPage, getLegalSEO, getLegalSlugs } from '@/sanity/queries/queries/legal'
import { LegalPage } from '@/components/LegalPage'
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

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getLegalSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const page = await getLegalSEO(slug)

  if (!page) {
    return {
      metadataBase: BASE_URL,
      title: siteTitle,
      description: siteDescription,
      robots: { index: false, follow: true },
    }
  }

  const title = page.seo?.title || page.title ? `${page.seo?.title || page.title} — ${siteTitle}` : siteTitle
  const description = page.seo?.description || siteDescription
  const imageUrl = page.seo?.image?.imageUrl || BASE_IMAGE_URL
  const imageWidth = page.seo?.image?.metadata?.dimensions?.width || BASE_IMAGE_WIDTH
  const imageHeight = page.seo?.image?.metadata?.dimensions?.height || BASE_IMAGE_HEIGHT
  const canonical = buildUrl(`/legals/${slug}`)

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
  }
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default async function LegalDetailPage({ params }: Props) {
  const { slug } = await params
  const page = await getLegalPage(slug)

  if (!page) notFound()

  return <LegalPage page={page} />
}
