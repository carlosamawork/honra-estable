import { groq } from 'next-sanity'
import { client } from '..'
import { image } from '../fragments/image'
import { homeModules } from '../fragments/home'
import type { HomeModule } from './product'

export type SanityImage = {
  caption: string | null
  alt: string | null
  ref: string
  imageUrl: string
  hotspot: unknown
  crop: unknown
  metadata: {
    dimensions: {
      width: number
      height: number
    }
  }
  filename: string
}

export type ShopProduct = {
  _id: string
  title: string
  handle: string
  price: number | null
  previewImage: string | null
  hoverImage: SanityImage | null
  color: string | null
}

type ShopProductVariant = {
  _id: string
  color: string | null
  price: number | null
  previewImage: string | null
}

type ShopProductRaw = Omit<ShopProduct, 'color'> & {
  variants: ShopProductVariant[] | null
}

export async function getShopModules(): Promise<HomeModule[]> {
  const result = await client.fetch<{ modules: HomeModule[] | null } | null>(
    groq`*[_type == "shop"][0]{
      ${homeModules}
    }`,
    {},
    {
      next: {
        tags: ['shop'],
        revalidate: 60,
      },
    }
  )

  return result?.modules ?? []
}

export async function getShopProducts(): Promise<ShopProduct[]> {
  const products = await client.fetch<ShopProductRaw[]>(
    groq`*[_type == "product" && store.status == "active" && !store.isDeleted] | order(orderRank asc) {
      _id,
      "title": store.title,
      "handle": store.slug.current,
      "price": store.priceRange.minVariantPrice,
      "previewImage": store.previewImageUrl,
      "hoverImage": hoverImage{
        ${image}
      },
      "variants": store.variants[]->{
        _id,
        "color": store.option1,
        "price": store.price,
        "previewImage": store.previewImageUrl
      }
    }`,
    {},
    {
      next: {
        tags: ['product'],
        revalidate: 60,
      },
    }
  )

  // Products with color variants become one card per color
  return products.flatMap(({ variants, ...product }) => {
    const colorVariants = (variants ?? []).filter(
      (variant) => variant.color && variant.color !== 'Default Title'
    )

    if (colorVariants.length === 0) {
      return [{ ...product, color: null }]
    }

    return colorVariants.map((variant) => ({
      ...product,
      _id: variant._id,
      price: variant.price ?? product.price,
      previewImage: variant.previewImage ?? product.previewImage,
      color: variant.color,
    }))
  })
}
