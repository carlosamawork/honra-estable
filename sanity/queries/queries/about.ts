import { cache } from 'react'
import { groq } from 'next-sanity'
import { client } from '..'
import { image } from '../fragments/image'
import { seo } from '../fragments/seo'
import { homeModules } from '../fragments/home'

export type AboutSEO = {
  seo: {
    title: string | null
    description: string | null
    image: {
      imageUrl: string | null
      metadata: { dimensions: { width: number; height: number } } | null
    } | null
  } | null
}

export type AboutHeroImage = {
  imageUrl: string
  alt: string | null
  metadata: { dimensions: { width: number; height: number } }
  filename: string
  ref: string
}

export type AboutHero = {
  image: AboutHeroImage | null
  textUp: unknown[] | null
  textDown: unknown[] | null
}

export type AboutModuleItem = {
  _key: string
  _type: 'imageItem' | 'textItem' | 'productItem'
  image?: AboutHeroImage
  body?: unknown[]
  title?: string
  featuredImage?: string
  price?: number
}

export type AboutModule = {
  _key: string
  columns: number
  height: 'auto' | 'medium' | 'full' | string
  items: AboutModuleItem[]
}

export type AboutData = {
  hero: AboutHero | null
  modules: AboutModule[]
}

const aboutQuery = groq`*[_type == "about"][0]{
  hero{
    image{
      ${image}
    },
    textUp,
    textDown
  },
  ${homeModules},
  seo{
    ${seo}
  }
}`

export const getAbout = cache(
  async (): Promise<AboutData & AboutSEO> =>
    client.fetch(aboutQuery, {}, { next: { tags: ['about'], revalidate: 3600 } })
)
