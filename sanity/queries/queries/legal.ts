import { groq } from 'next-sanity'
import { client } from '..'
import { seo } from '../fragments/seo'

export type LegalPage = {
  title: string
  slug: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[] | null
}

export type LegalSEO = {
  title: string | null
  seo: {
    title: string | null
    description: string | null
    image: {
      imageUrl: string | null
      metadata: { dimensions: { width: number; height: number } } | null
    } | null
  } | null
}

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
  return client.fetch(
    groq`*[_type == "legal" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      body
    }`,
    { slug },
    {
      next: {
        tags: ['legal'],
        revalidate: 3600,
      },
    }
  )
}

export async function getLegalSEO(slug: string): Promise<LegalSEO | null> {
  return client.fetch(
    groq`*[_type == "legal" && slug.current == $slug][0]{
      title,
      seo{
        ${seo}
      }
    }`,
    { slug },
    { next: { tags: ['legal'], revalidate: 3600 } }
  )
}

export async function getLegalSlugs(): Promise<string[]> {
  return client.fetch(
    groq`*[_type == "legal" && defined(slug.current)].slug.current`,
    {},
    { next: { tags: ['legal'], revalidate: 3600 } }
  )
}
