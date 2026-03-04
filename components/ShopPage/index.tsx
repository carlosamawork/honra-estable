import React from 'react'
import Link from 'next/link'
import LazyImage from '@/components/Common/LazyImage'
import { ShopProduct } from '@/sanity/queries/queries/shop'
import s from './ShopPage.module.scss'

type ShopPageProps = {
  products: ShopProduct[]
}

const formatPrice = (value: number | null): string => {
  if (typeof value !== 'number') return ''
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)
}

export function ShopPage({ products }: ShopPageProps): React.ReactElement {
  return (
    <main className={s.shop}>
      <div className={s.grid}>
        {products.map((product) => (
          <Link key={product._id} href={`/products/${product.handle}`} className={s.card}>
            <div className={s.imageWrapper}>
              {product.previewImage && (
                <div className={s.imageDefault}>
                  <LazyImage
                    src={product.previewImage}
                    alt={product.title}
                    width={720}
                    height={676}
                    fill={true}
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
    </main>
  )
}
