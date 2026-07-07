import React from 'react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { PortableText } from '@portabletext/react'
import LazyImage from '@/components/Common/LazyImage'
import { ShopProduct } from '@/sanity/queries/queries/shop'
import type { HomeModule, HomeModuleItem } from '@/sanity/queries/queries/product'
import { portableBlockComponents } from '@/utils/portableText/portableText'
import s from './ShopPage.module.scss'

type ShopPageProps = {
  products: ShopProduct[]
  modules?: HomeModule[]
}

const getHeightClass = (height?: string) => {
  if (height === 'full') return s.moduleFull
  if (height === 'medium') return s.moduleMedium
  return s.moduleAuto
}

const formatPrice = (value: number | null): string => {
  if (typeof value !== 'number') return ''
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)
}

export function ShopPage({ products, modules }: ShopPageProps): React.ReactElement {
  return (
    <main className={s.shop}>
      <div className={s.grid}>
        {products.map((product) => (
          <Link
            key={product._id}
            href={
              product.color
                ? `/products/${product.handle}?color=${encodeURIComponent(product.color)}`
                : `/products/${product.handle}`
            }
            className={s.card}
          >
            <div className={s.imageWrapper}>
              {product.previewImage && (
                <div className={s.imageDefault}>
                  <LazyImage
                    src={product.previewImage}
                    alt={product.color ? `${product.title} — ${product.color}` : product.title}
                    width={720}
                    height={676}
                    fill={true}
                    sizes="(max-width: 991px) 100vw, 50vw"
                    objectFit="cover"
                  />
                </div>
              )}
              {product.hoverImage && (
                <div className={s.imageHover}>
                  <LazyImage
                    src={product.hoverImage.imageUrl}
                    alt={product.hoverImage.alt || product.title}
                    width={product.hoverImage.metadata.dimensions.width}
                    height={product.hoverImage.metadata.dimensions.height}
                    fill={true}
                    objectFit="cover"
                    filename={product.hoverImage.filename}
                  />
                </div>
              )}
            </div>
            <div className={s.info}>
              <span className={s.title}>{product.title}</span>
              <span className={s.price}>{formatPrice(product.price)}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* MODULES — campaign content from the shop singleton (same pattern as ProductPage) */}
      {modules?.map((module, moduleIndex) => {
        const columns = Math.min(Math.max(module.columns || 1, 1), 8)
        const heightClass = getHeightClass(module.height)

        return (
          <section
            key={module._key || `module-${moduleIndex}`}
            className={`${s.module} ${heightClass}`}
            style={{ '--module-columns': columns } as CSSProperties}
          >
            {module.items?.map((item: HomeModuleItem, itemIndex: number) => {
              const key = item._key || `item-${itemIndex}`
              const isImage = item._type === 'imageItem'
              const isText = item._type === 'textItem'

              return (
                <article key={key} className={s.moduleItem}>
                  {isImage && item.image?.imageUrl && (
                    <LazyImage
                      src={item.image.imageUrl}
                      alt={item.image.alt || ''}
                      width={item.image.metadata?.dimensions.width ?? 1440}
                      height={item.image.metadata?.dimensions.height ?? 800}
                      filename={item.image.filename}
                      fill={true}
                      sizes="100vw"
                      objectFit="cover"
                    />
                  )}
                  {isText && item.body && (
                    <div className={s.moduleText}>
                      <PortableText value={item.body} components={portableBlockComponents()} />
                    </div>
                  )}
                </article>
              )
            })}
          </section>
        )
      })}
    </main>
  )
}
