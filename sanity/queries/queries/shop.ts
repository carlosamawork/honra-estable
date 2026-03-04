import { groq } from 'next-sanity'
import { client } from '..'
import { image } from '../fragments/image'

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
}

export async function getShopProducts(): Promise<ShopProduct[]> {
  return client.fetch(
    groq`*[_type == "product" && store.status == "active" && !store.isDeleted] | order(orderRank asc) {
      _id,
      "title": store.title,
      "handle": store.slug.current,
      "price": store.priceRange.minVariantPrice,
      "previewImage": store.previewImageUrl,
      "hoverImage": hoverImage{
        ${image}
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
}
