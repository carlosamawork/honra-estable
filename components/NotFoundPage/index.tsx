import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import type { NotFoundData } from '@/sanity/types'
import { portableBlockComponents } from '@/utils/portableText/portableText'
import s from './NotFoundPage.module.scss'

type Props = {
  data?: NotFoundData
}

export function NotFoundPage({ data }: Props): React.ReactElement {
  return (
    <main className={s.notFound}>
      <h1 className={s.title}>{data?.title || 'Page not found'}</h1>
      {data?.body?.length ? (
        <div className={s.body}>
          <PortableText
            value={data.body as PortableTextBlock[]}
            components={portableBlockComponents()}
          />
        </div>
      ) : (
        <p className={s.body}>The page you are looking for does not exist or has been moved.</p>
      )}
      <Link href="/" className={s.link}>
        Back to home
      </Link>
    </main>
  )
}
