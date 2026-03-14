import { cache } from 'react'
import { groq } from 'next-sanity'
import { client } from '..'
import { image } from '../fragments/image'
import { seo } from '../fragments/seo'
import { homeModules } from '../fragments/home'

export type ExploreImageData = {
  imageUrl: string
  alt: string | null
  caption: string | null
  metadata: { dimensions: { width: number; height: number } }
  filename: string
  ref: string
}

export type ExploreModuleItem = {
  _key: string
  _type: 'imageItem' | 'textItem' | 'productItem'
  image?: ExploreImageData
  body?: unknown[]
  _id?: string
  title?: string
  featuredImage?: ExploreImageData
  price?: number
}

export type ExploreModule = {
  _key: string
  columns: number
  height: 'auto' | 'medium' | 'full'
  items: ExploreModuleItem[]
}

export type ExploreHero = {
  title: string | null
  subtitle: string | null
  image: ExploreImageData | null
}

export type ExploreSEO = {
  seo: {
    title: string | null
    description: string | null
    image: {
      imageUrl: string | null
      metadata: { dimensions: { width: number; height: number } } | null
    } | null
  } | null
}

export type ExploreData = {
  title: string
  hero: ExploreHero | null
  modules: ExploreModule[]
}

const explorePageQuery = groq`*[_type == "page" && slug.current == $slug][0]{
  title,
  hero{
    title,
    subtitle,
    image{
      ${image}
    }
  },
  ${homeModules},
  seo{
    ${seo}
  }
}`

export const getExplorePage = cache(
  async (slug: string): Promise<(ExploreData & ExploreSEO) | null> =>
    client.fetch(explorePageQuery, { slug }, { next: { tags: [`page:${slug}`], revalidate: 300 } })
)

export const getExplorePageSlugs = cache(
  async (): Promise<string[]> =>
    client.fetch(
      groq`*[_type == "page" && defined(slug.current)][].slug.current`,
      {},
      { next: { tags: ['page'], revalidate: 3600 } }
    )
)
