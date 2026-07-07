import { PortableText } from '@portabletext/react'
import type { LegalPage as LegalPageData } from '@/sanity/queries/queries/legal'
import { portableBlockComponents } from '@/utils/portableText/portableText'
import s from './LegalPage.module.scss'

type Props = {
  page: LegalPageData
}

export function LegalPage({ page }: Props): React.ReactElement {
  return (
    <main className={s.legal}>
      <h1 className={s.srTitle}>{page.title}</h1>
      {page.body && (
        <div className={s.body}>
          <PortableText value={page.body} components={portableBlockComponents()} />
        </div>
      )}
    </main>
  )
}
