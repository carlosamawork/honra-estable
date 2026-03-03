import { image } from './image'

export const homeHero = `
  hero{
    image{
      ${image}
    },
    logo{
      ${image}
    }
  }
`

export const homeModules = `
  modules[]{
    _key,
    columns,
    height,
    items[]{
      _key,
      _type,
      _type == "productItem" => @->{
        _id,
        _type,
        "title": coalesce(store.title, title),
        "featuredImage": store.previewImageUrl,
        "price": store.priceRange.minVariantPrice
      },
      _type == "imageItem" => {
        _key,
        _type,
        image{
          ${image}
        }
      },
      _type == "textItem" => {
        _key,
        _type,
        body
      }
    }
  }
`
