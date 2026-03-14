'use client'

import { useContext, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import LazyImage from '@/components/Common/LazyImage'
import { CartContext } from '@/context/shopContext'
import type {
  ProductDetail,
  ProductVariant,
  HomeModuleItem,
} from '@/sanity/queries/queries/product'
import { portableBlockComponents } from '@/utils/portableText/portableText'
import s from './ProductPage.module.scss'

type Props = {
  product: ProductDetail
}

const formatPrice = (value: number | null): string => {
  if (typeof value !== 'number') return ''
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)
}

const getHeightClass = (height?: string) => {
  if (height === 'full') return s.moduleFull
  if (height === 'medium') return s.moduleMedium
  return s.moduleAuto
}

export function ProductPage({ product }: Props) {
  const { addToCart } = useContext(CartContext)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] ?? null
  )
  const [openAccordion, setOpenAccordion] = useState<number | null>(null)

  const colorOption = product.customProductOptions?.find(
    (opt) => opt.title.toLowerCase() === 'color'
  )

  const selectedColorTitle = selectedVariant?.store?.option1 ?? null

  function handleAddToCart() {
    if (!selectedVariant) return
    addToCart(
      selectedVariant,
      1,
      product._id,
      product.title,
      product.previewImage ?? selectedVariant.store.previewImageUrl ?? product.images?.[0]?.imageUrl
    )
  }

  console.log('Product data:', product) // Debug log to check product data structure

  return (
    <main className={s.product}>
      <div className={s.topSection}>
        {/* LEFT — gallery */}
        <div className={s.gallery}>
          {product.images?.map((img, i) => (
            <div key={i} className={s.galleryItem}>
              <LazyImage
                src={img.imageUrl}
                alt={img.alt || product.title}
                width={img.metadata.dimensions.width}
                height={img.metadata.dimensions.height}
                filename={img.filename}
                blurDataURL={img.ref}
                fill={true}
                sizes="(max-width: 768px) 100vw, 58vw"
                objectFit="cover"
              />
            </div>
          ))}
        </div>

        {/* RIGHT — product info */}
        <aside className={s.info}>
          <div className={s.infoInner}>

            {/* Title + price + description */}
            <h1 className={s.title}>{product.title}</h1>
            <p className={s.price}>{formatPrice(product.price)}</p>

            {product.descriptionHtml && (
              <div
                className={s.description}
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            )}

            {/* Color selector */}
            {colorOption && colorOption.colors.length > 0 && (
              <div className={s.colorSelector}>
                {selectedColorTitle && (
                  <p className={s.colorLabel}>{selectedColorTitle}</p>
                )}
                <div className={s.colors}>
                  {colorOption.colors.map((c) => {
                    const matchingVariant = product.variants?.find(
                      (v) => v.store.option1 === c.title
                    )
                    const isSelected = selectedVariant?.store?.option1 === c.title
                    return (
                      <button
                        key={c.title}
                        className={`${s.colorSwatch} ${isSelected ? s.colorSwatchActive : ''}`}
                        style={{ '--swatch-color': c.color } as CSSProperties}
                        aria-label={c.title}
                        aria-pressed={isSelected}
                        onClick={() => {
                          if (matchingVariant) setSelectedVariant(matchingVariant)
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <button
              className={s.addToCart}
              onClick={handleAddToCart}
              disabled={!selectedVariant?.store?.inventory?.isAvailable}
            >
              {selectedVariant?.store?.inventory?.isAvailable === false
                ? 'Agotado'
                : 'Agregar al carrito'}
            </button>

            {/* Characteristics accordion */}
            {product.characteristics?.items?.map((item, itemIndex) => {
                const accordionKey = itemIndex
                const isOpen = openAccordion === accordionKey
                return (
                  <div key={accordionKey} className={s.accordion}>
                    <button
                      className={s.accordionTrigger}
                      aria-expanded={isOpen}
                      onClick={() => setOpenAccordion(isOpen ? null : accordionKey)}
                    >
                      <span>+ {item.title}</span>
                    </button>
                    {isOpen && (
                      <div className={s.accordionContent}>
                        {item.image?.imageUrl && (
                          <div className={s.accordionImage}>
                            <LazyImage
                              src={item.image.imageUrl}
                              alt={item.image.alt || item.title || ''}
                              width={item.image.metadata.dimensions.width}
                              height={item.image.metadata.dimensions.height}
                              filename={item.image.filename}
                              fill={false}
                            />
                          </div>
                        )}
                        {item.body && (
                          <div className={s.accordionBody}>
                            <PortableText
                              value={item.body}
                              components={portableBlockComponents()}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </aside>
      </div>
      {/* MODULES — campaign images (same pattern as Home) */}
      {product.modules?.map((module, moduleIndex) => {
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
                      <PortableText
                        value={item.body}
                        components={portableBlockComponents()}
                      />
                    </div>
                  )}
                </article>
              )
            })}
          </section>
        )
      })}

      {/* RELATED PRODUCTS */}
      {product.relatedProducts?.length > 0 && (
        <section className={s.related}>
          <p className={s.relatedTitle}>Related product</p>
          <div className={s.relatedGrid}>
            {product.relatedProducts.map((rel) => (
              <Link key={rel._id} href={`/products/${rel.handle}`} className={s.relatedCard}>
                <div className={s.relatedImage}>
                  {rel.previewImage && (
                    <LazyImage
                      src={rel.previewImage}
                      alt={rel.title}
                      width={720}
                      height={674}
                      fill={true}
                      objectFit="cover"
                    />
                  )}
                </div>
                <p className={s.relatedName}>{rel.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
