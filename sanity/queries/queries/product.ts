import { groq } from 'next-sanity'
import { client } from '..'
import { image } from '../fragments/image'
import { seo } from '../fragments/seo'
import { homeModules } from '../fragments/home'
import type { SanityImage } from './shop'

export type ProductColorOption = {
  title: string
  color: string
}

export type ProductCustomOption = {
  title: string
  colors: ProductColorOption[]
}

export type ProductVariant = {
  _id: string
  store: {
    gid: string
    title: string
    price: number
    option1: string | null
    option2: string | null
    option3: string | null
    previewImageUrl: string | null
    inventory: {
      isAvailable: boolean
    }
  }
}

export type ProductShopifyOption = {
  name: string
  values: string[]
}

export type RelatedProduct = {
  _id: string
  title: string
  handle: string
  price: number | null
  previewImage: string | null
  hoverImage: SanityImage | null
}

export type HomeModuleItem = {
  _key: string
  _type: 'imageItem' | 'textItem' | 'productItem' | string
  image?: SanityImage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any[]
  title?: string
  featuredImage?: string
  price?: number
}

export type HomeModule = {
  _key: string
  columns: number
  height: 'auto' | 'medium' | 'full' | string
  items: HomeModuleItem[]
}

export type CharacteristicItem = {
  title: string
  image: (SanityImage & { alt?: string }) | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[]
}

export type Characteristic = {
  items: CharacteristicItem[]
}

export type ProductDetail = {
  _id: string
  title: string
  handle: string
  price: number | null
  previewImage: string | null
  descriptionHtml: string | null
  images: SanityImage[]
  customProductOptions: ProductCustomOption[]
  shopifyOptions: ProductShopifyOption[]
  variants: ProductVariant[]
  characteristics: Characteristic
  relatedProducts: RelatedProduct[]
  modules: HomeModule[]
}

export async function getProduct(handle: string): Promise<ProductDetail | null> {
  return client.fetch(
    groq`*[_type == "product" && store.slug.current == $handle && store.status == "active" && !store.isDeleted][0]{
      _id,
      "title": store.title,
      "handle": store.slug.current,
      "price": store.priceRange.minVariantPrice,
      "previewImage": store.previewImageUrl,
      "descriptionHtml": store.descriptionHtml,
      "images": images[]{
        ${image}
      },
      "customProductOptions": customProductOptions[]{
        title,
        colors[]{
          title,
          color
        }
      },
      "shopifyOptions": store.options[]{
        name,
        values
      },
      "characteristics": characteristics{
        items[]{
          title,
          image{
            ${image}
          },
          body
        }
      },
      "variants": store.variants[]->{
        _id,
        store{
          gid,
          title,
          price,
          option1,
          option2,
          option3,
          previewImageUrl,
          inventory{
            isAvailable
          }
        }
      },
      ${homeModules},
      "relatedProducts": relatedProducts[]->{
        _id,
        "title": store.title,
        "handle": store.slug.current,
        "price": store.priceRange.minVariantPrice,
        "previewImage": store.previewImageUrl,
        "hoverImage": hoverImage{
          ${image}
        }
      }
    }`,
    { handle },
    {
      next: {
        tags: ['product'],
        revalidate: 60,
      },
    }
  )
}

export type ProductSEO = {
  title: string | null
  descriptionHtml: string | null
  previewImage: string | null
  seo: {
    title: string | null
    description: string | null
    image: {
      imageUrl: string | null
      metadata: { dimensions: { width: number; height: number } } | null
    } | null
  } | null
}

export async function getProductSEO(handle: string): Promise<ProductSEO | null> {
  return client.fetch(
    groq`*[_type == "product" && store.slug.current == $handle && store.status == "active" && !store.isDeleted][0]{
      "title": store.title,
      "descriptionHtml": store.descriptionHtml,
      "previewImage": store.previewImageUrl,
      seo{
        ${seo}
      }
    }`,
    { handle },
    { next: { tags: ['product'], revalidate: 60 } }
  )
}

export async function getProductHandles(): Promise<{ handle: string }[]> {
  return client.fetch(
    groq`*[_type == "product" && store.status == "active" && !store.isDeleted]{
      "handle": store.slug.current
    }`,
    {},
    { next: { tags: ['product'], revalidate: 3600 } }
  )
}
