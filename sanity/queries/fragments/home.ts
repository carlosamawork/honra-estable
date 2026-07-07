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
      // Soporta la forma nueva (productWithVariant) y las referencias antiguas (@->)
      _type == "productItem" => {
        _key,
        _type,
        "_id": coalesce(variant->_id, product->_id, @->_id),
        "title": coalesce(product->store.title, @->store.title),
        "handle": coalesce(product->store.slug.current, @->store.slug.current),
        "featuredImage": coalesce(
          variant->store.previewImageUrl,
          product->store.previewImageUrl,
          @->store.previewImageUrl
        ),
        "price": coalesce(
          variant->store.price,
          product->store.priceRange.minVariantPrice,
          @->store.priceRange.minVariantPrice
        ),
        "color": select(
          variant->store.option1 == "Default Title" => null,
          variant->store.option1
        )
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
