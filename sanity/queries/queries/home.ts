import { groq } from 'next-sanity'
import { client } from '..'
import { seo } from '../fragments/seo'
import image from 'next/image'

export async function getHome() {
    return client.fetch(
        groq`*[_type == "home"][0]{
                hero{
                    title,
                    listOfImages[]{
                        imageDesktop{
                            ${image}
                        },
                        imageMobile{
                            ${image}
                        }
                    }
                }
            }`
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