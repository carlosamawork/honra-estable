import type { Metadata } from 'next'
import { NotFoundPage } from '@/components/NotFoundPage'
import { getNotFoundPage } from '@/sanity/queries/common/labels'
import { siteTitle } from '@/utils/seoHelper'

export const metadata: Metadata = {
  title: `Page not found — ${siteTitle}`,
  robots: { index: false, follow: false },
}

export default async function NotFound(): Promise<React.ReactElement> {
  const data = await getNotFoundPage().catch(() => undefined)
  return <NotFoundPage data={data} />
}
