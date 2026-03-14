import type { Viewport } from 'next'
import HomeComponent from '@/components/Home';
import { getDefaultSEO } from '@/sanity/queries/common/defaultSEO';
import { getHome, getHomeSEO } from '@/sanity/queries/queries/home';
import { BASE_IMAGE_HEIGHT, BASE_IMAGE_URL, BASE_IMAGE_WIDTH, BASE_URL, buildUrl, getFavicons, siteDescription, siteTitle } from '@/utils/seoHelper';


export const revalidate = 1 // revalidate to work set to 1, then we change it to 10

export async function generateMetadata() {
  const [page, defaultSEO] = await Promise.all([getHomeSEO(), getDefaultSEO()]);

  if (!page) {
    return {
      metadataBase: BASE_URL,
      title: `${page?.seo?.title || siteTitle}`,
      description: page?.seo?.description || siteDescription,
      robots: {
        index: false,
        follow: true,
        nocache: false,
        googleBot: {
          index: false,
          follow: true,
                    'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      alternates: {
        canonical: BASE_URL.origin,
      },
    }
  }


  return {
    metadataBase: BASE_URL,
    title: `${page.seo?.title || siteTitle}`,
    description: page.seo?.description || siteDescription,
    openGraph: {
      title: `${page.seo?.title || siteTitle}`,
      description: page.seo?.description || siteDescription,
      url: buildUrl("/"),
      siteName: siteTitle,
      images: [
        {
          url: page.seo?.image?.imageUrl || BASE_IMAGE_URL,
          width: page.seo?.image?.metadata?.dimensions?.width || BASE_IMAGE_WIDTH,
          height: page.seo?.image?.metadata?.dimensions?.height || BASE_IMAGE_HEIGHT,
        },
      ],
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
                'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: getFavicons(),
    alternates: {
      canonical: buildUrl("/")
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page.seo?.title || siteTitle}`,
      description: page.seo?.description || siteDescription,
      images: [
        page.seo?.image?.imageUrl || BASE_IMAGE_URL,
      ],
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default async function Home() {
  const home = await getHome()

  return (
    <main>
      <HomeComponent data={home} />
    </main>
  )
}
