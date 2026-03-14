'use client'

import type { CSSProperties } from 'react'
import { PortableText } from '@portabletext/react'
import s from './AboutPage.module.scss'
import LazyImage from '@/components/Common/LazyImage'
import { portableBlockComponents } from '@/utils/portableText/portableText'
import type { AboutData, AboutModuleItem } from '@/sanity/queries/queries/about'

type Props = {
  data: AboutData
}

const getHeightClass = (height?: string) => {
  if (height === 'full') return s.isFull
  if (height === 'medium') return s.isMedium
  return s.isAuto
}

function ModuleItem({ item }: { item: AboutModuleItem }) {
  if (item._type === 'imageItem') {
    return (
      <article className={`${s.moduleItem} ${s.imageModuleItem}`}>
        <div className={s.imageItem}>
          {item.image?.imageUrl ? (
            <LazyImage
              src={item.image.imageUrl}
              alt={item.image.alt || ''}
              width={item.image.metadata.dimensions.width}
              height={item.image.metadata.dimensions.height}
              fill={true}
              objectFit="cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className={s.imageFallback} aria-hidden="true" />
          )}
        </div>
      </article>
    )
  }

  if (item._type === 'textItem') {
    return (
      <article className={s.moduleItem}>
        <div className={s.textItem}>
          <PortableText value={(item.body as []) || []} components={portableBlockComponents()} />
        </div>
      </article>
    )
  }

  if (item._type === 'productItem') {
    return (
      <article className={s.moduleItem}>
        <div className={s.productItem}>
          {item.featuredImage ? (
            <LazyImage
              src={item.featuredImage}
              alt={item.title || 'Product image'}
              width={500}
              height={500}
              fill={true}
              objectFit="cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className={s.imageFallback} aria-hidden="true" />
          )}
        </div>
        {item.title && (
          <div className={s.productInfo}>
            <h3>{item.title}</h3>
          </div>
        )}
      </article>
    )
  }

  return null
}

export function AboutPage({ data }: Props) {
  const hero = data?.hero
  const modules = data?.modules || []

  return (
    <main className={s.about}>
      <section className={s.hero}>
        {hero?.image?.imageUrl && (
          <LazyImage
            src={hero.image.imageUrl}
            alt={hero.image.alt || ''}
            width={hero.image.metadata.dimensions.width}
            height={hero.image.metadata.dimensions.height}
            fill={true}
            objectFit="cover"
            sizes="100vw"
            defaultInView={true}
          />
        )}

        <div className={s.heroContent}>
          {hero?.textUp && (
            <div className={s.heroTextUp}>
              <PortableText value={hero.textUp as []} components={portableBlockComponents()} />
            </div>
          )}
          {hero?.textDown && (
            <div className={s.heroTextDown}>
              <PortableText value={hero.textDown as []} components={portableBlockComponents()} />
            </div>
          )}
        </div>
      </section>

      {modules.map((module, moduleIndex) => {
        const columns = Math.min(Math.max(module.columns || 1, 1), 8)
        const heightClass = getHeightClass(module.height)

        return (
          <section
            key={module._key || `module-${moduleIndex}`}
            className={`${s.module} ${heightClass}`}
            style={{ '--module-columns': columns } as CSSProperties}
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
