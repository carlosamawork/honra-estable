import { groq } from 'next-sanity'
import { client } from '..'
import { homeHero, homeModules } from '../fragments/home'
import { seo } from '../fragments/seo'

export async function getHome() {
  return client.fetch(
    groq`*[_type == "home"][0]{
      ${homeHero},
      ${homeModules}
    }`,
    {},
    {
      next: {
        tags: ['home'],
        revalidate: 60,
      },
    }
  )
}

export async function getHomeSEO() {
    return client.fetch(
        groq`*[_type == "home"][0]{
                 seo{
                    ${seo}
                }
            }`
    )
}
