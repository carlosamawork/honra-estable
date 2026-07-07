'use client'

import type { CSSProperties } from 'react'
import { PortableText } from '@portabletext/react'
import s from './ExplorePage.module.scss'
import LazyImage from '@/components/Common/LazyImage'
import { portableBlockComponents } from '@/utils/portableText/portableText'
import type { ExploreData, ExploreModuleItem } from '@/sanity/queries/queries/explore'

type Props = {
  data: ExploreData
}

const getHeightClass = (height?: string) => {
  if (height === 'full') return s.isFull
  if (height === 'medium') return s.isMedium
  return s.isAuto
}

function ModuleItem({ item }: { item: ExploreModuleItem }) {
  if (item._type === 'imageItem') {
    const img = item.image

    return (
      <article className={s.moduleItem}>
        <div className={s.imageWrapper}>
          {img?.imageUrl ? (
            <LazyImage
              src={img.imageUrl}
              alt={img.alt || ''}
              width={img.metadata?.dimensions?.width ?? 1200}
              height={img.metadata?.dimensions?.height ?? 800}
              fill={false}
              objectFit="cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              filename={img.filename}
              blurDataURL={img.ref}
            />
          ) : (
            <div className={s.imageFallback} aria-hidden="true" />
          )}
          {img?.caption && <p className={s.caption}>{img.caption}</p>}
        </div>
      </article>
    )
  }

  if (item._type === 'textItem') {
    return (
      <article className={`${s.moduleItem} ${s.textModuleItem}`}>
        <div className={s.textItem}>
          <PortableText value={(item.body as []) || []} components={portableBlockComponents()} />
        </div>
      </article>
    )
  }

  if (item._type === 'productItem') {
    return (
      <article className={s.moduleItem}>
        <div className={s.imageWrapper}>
          {item.featuredImage ? (
            <LazyImage
              src={item.featuredImage.imageUrl}
              alt={item.title || 'Product image'}
              width={item.featuredImage.metadata?.dimensions?.width ?? 500}
              height={item.featuredImage.metadata?.dimensions?.height ?? 500}
              fill={true}
              objectFit="cover"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          ) : (
            <div className={s.imageFallback} aria-hidden="true" />
          )}
        </div>
        {item.title && <p className={s.caption}>{item.title}</p>}
      </article>
    )
  }

  return null
}

export function ExplorePage({ data }: Props) {
  const hero = data?.hero
  const modules = data?.modules || []

  return (
    <main className={s.explore}>
      {hero?.image?.imageUrl && (
        <section className={s.hero}>
          <div className={s.heroImage}>
            <LazyImage
              src={hero.image.imageUrl}
              alt={hero.image.alt || hero.title || ''}
              width={hero.image.metadata?.dimensions?.width ?? 1200}
              height={hero.image.metadata?.dimensions?.height ?? 800}
              fill={true}
              objectFit="cover"
              sizes="100vw"
              defaultInView={true}
              filename={hero.image.filename}
              blurDataURL={hero.image.ref}
            />
          </div>
          {(hero.title || hero.subtitle) && (
            <div className={s.heroContent}>
              {hero.title && <h1 className={s.heroTitle}>{hero.title}</h1>}
              {hero.subtitle && <p className={s.heroSubtitle}>{hero.subtitle}</p>}
            </div>
          )}
        </section>
      )}

      {modules.map((module, moduleIndex) => {
        const columns = Math.min(Math.max(module.columns || 1, 1), 8)
        const heightClass = getHeightClass(module.height)

        return (
          <section
            key={module._key || `module-${moduleIndex}`}
            className={`${s.module} ${heightClass}`}
            style={
              {
                '--columns': columns,
                '--columns-mobile': Math.min(columns, 2),
              } as CSSProperties
            }
          >
            {(module.items || []).map((item, itemIndex) => (
              <ModuleItem key={item._key || `item-${itemIndex}`} item={item} />
            ))}
          </section>
        )
      })}
    </main>
  )
}
