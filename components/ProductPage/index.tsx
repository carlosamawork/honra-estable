'use client'

import { Fragment, useContext, useEffect, useState, type CSSProperties } from 'react'
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

export type VariantGalleryImage = {
  url: string
  width: number | null
  height: number | null
  altText: string | null
}

export type VariantGalleries = Record<string, VariantGalleryImage[]>

export type ShopifyColorValue = {
  name: string
  swatchColor: string | null
  swatchImageUrl: string | null
}

type Props = {
  product: ProductDetail
  variantGalleries?: VariantGalleries
  productImages?: VariantGalleryImage[]
  shopifyColorValues?: ShopifyColorValue[]
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

export function ProductPage({
  product,
  variantGalleries,
  productImages,
  shopifyColorValues,
}: Props) {
  const { addToCart } = useContext(CartContext)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] ?? null
  )
  const [openAccordion, setOpenAccordion] = useState<number | null>(null)

  // Preselect the color coming from a card link (/products/handle?color=Beige)
  useEffect(() => {
    const color = new URLSearchParams(window.location.search).get('color')
    if (!color) return
    const variant = product.variants?.find((v) => v.store.option1 === color)
    if (variant) setSelectedVariant(variant)
  }, [product.variants])

  const sanityColorOption = product.customProductOptions?.find(
    (opt) => opt.title.toLowerCase() === 'color'
  )

  // Color swatches: Shopify option values (taxonomy/metaobject swatch) are the
  // source of truth; Sanity hex or the CSS color name cover values without swatch
  const colorValues: { title: string; color: string }[] = shopifyColorValues?.length
    ? shopifyColorValues.map((value) => ({
        title: value.name,
        color:
          value.swatchColor ??
          sanityColorOption?.colors.find((c) => c.title === value.name)?.color ??
          value.name.toLowerCase(),
      }))
    : (sanityColorOption?.colors ?? [])

  const selectedColorTitle = selectedVariant?.store?.option1 ?? null

  // Gallery: selected variant (variant image + custom.gallery metafield),
  // or the Shopify product images list for products without variant galleries
  const galleryImages =
    (selectedVariant && variantGalleries?.[selectedVariant.store.title]) ||
    productImages ||
    []

  function handleAddToCart() {
    if (!selectedVariant) return
    addToCart(
      selectedVariant,
      1,
      product._id,
      product.title,
      selectedVariant.store.previewImageUrl ?? product.previewImage ?? galleryImages[0]?.url
    )
  }

  const accordions = product.characteristics?.items?.map((item, itemIndex) => {
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
                <PortableText value={item.body} components={portableBlockComponents()} />
              </div>
            )}
          </div>
        )}
      </div>
    )
  })

  return (
    <main className={s.product}>
      <div className={s.topSection}>
        {/* LEFT — gallery (Shopify: variant image + variant gallery, or product images) */}
        <div className={s.gallery}>
          {galleryImages.map((img, i) => (
            <Fragment key={`${selectedVariant?.store.title ?? 'product'}-${i}`}>
              <div className={s.galleryItem}>
                <LazyImage
                  src={img.url}
                  alt={img.altText || `${product.title}${selectedColorTitle ? ` — ${selectedColorTitle}` : ''}`}
                  width={img.width ?? 1080}
                  height={img.height ?? 1080}
                  fill={true}
                  sizes="(max-width: 768px) 100vw, 58vw"
                  objectFit="cover"
                />
              </div>
              {/* Mobile: descripción bajo la primera imagen (Figma 311:3827) */}
              {i === 0 && product.descriptionHtml && (
                <div
                  className={s.descriptionMobile}
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              )}
            </Fragment>
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
            {colorValues.length > 0 && (
              <div className={s.colorSelector}>
                {selectedColorTitle && (
                  <p className={s.colorLabel}>{selectedColorTitle}</p>
                )}
                <div className={s.colors}>
                  {colorValues.map((c) => {
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
                          if (!matchingVariant) return
                          setSelectedVariant(matchingVariant)
                          const prefersReducedMotion = window.matchMedia(
                            '(prefers-reduced-motion: reduce)'
                          ).matches
                          window.scrollTo({
                            top: 0,
                            behavior: prefersReducedMotion ? 'auto' : 'smooth',
                          })
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

            {/* Characteristics accordion — desktop (en mobile van tras la galería) */}
            <div className={s.accordionsDesktop}>{accordions}</div>
          </div>
        </aside>
      </div>

      {/* Characteristics accordion — mobile (Figma 311:3832) */}
      <section className={s.accordionsMobile}>{accordions}</section>
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
          <p className={s.relatedTitle}>Related products</p>
          <div className={s.relatedGrid}>
            {product.relatedProducts.map((rel, relIndex) => (
              <Link
                key={`${rel._id}-${relIndex}`}
                href={
                  rel.color
                    ? `/products/${rel.handle}?color=${encodeURIComponent(rel.color)}`
                    : `/products/${rel.handle}`
                }
                className={s.relatedCard}
              >
                <div className={s.relatedImage}>
                  {rel.previewImage && (
                    <LazyImage
                      src={rel.previewImage}
                      alt={rel.color ? `${rel.title} — ${rel.color}` : rel.title}
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
