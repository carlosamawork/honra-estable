import WelcomeComponent from '@/components/Welcome/WelcomeComponent';
import { getDefaultSEO } from '@/sanity/queries/common/defaultSEO';
import { getHomeSEO } from '@/sanity/queries/queries/home';
import { BASE_IMAGE_HEIGHT, BASE_IMAGE_URL, BASE_IMAGE_WIDTH, BASE_URL, buildUrl, getFavicons, siteDescription, siteTitle } from '@/utils/seoHelper';


export const revalidate = 1 // revalidate to work set to 1, then we change it to 10

export async function generateMetadata() {
  const page = await getHomeSEO();
  const defaultSEO = await getDefaultSEO();

  if (!page) {
    return {
      metadataBase: BASE_URL,
      title: `${page.seo?.title || siteTitle}`,
      description: page.seo?.description || siteDescription,
      robots: {
        index: false,
        follow: true,
        nocache: false,
        googleBot: {
          index: false,
          follow: true,
          'max-video-preview': -1,
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
    generator: 'Next.js',
    applicationName: 'Conti, Cert. by ama.work',
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
        'max-video-preview': -1,
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

export default async function Home() {

  return (
    <main>
      <WelcomeComponent />
    </main>
  )
}