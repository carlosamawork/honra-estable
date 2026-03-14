// Rich text annotations used in the block content editor
import annotationLinkEmail from './annotations/linkEmail'
import annotationLinkExternal from './annotations/linkExternal'
import annotationLinkInternal from './annotations/linkInternal'
import annotationProduct from './annotations/product'

const annotations = [
  annotationLinkEmail,
  annotationLinkExternal,
  annotationLinkInternal,
  annotationProduct,
]

// Document types
import page from './documents/page'
import product from './documents/product'
import productVariant from './documents/productVariant'
import collection from './documents/collection'
import legal from './documents/legal'


const documents = [page, product, productVariant, collection, legal]

// Singleton document types
import home from './singletons/home'
import settings from './singletons/settings'
import about from './singletons/about'

const singletons = [home, settings, about]

// Block content
import body from './blocks/body'
import bodySimple from './blocks/bodySimple'
import bodyTextTerms from './blocks/bodyTextTerms'

const blocks = [body, bodySimple, bodyTextTerms]

// Object types
import modulePage from './objects/module/module'
import footer from './objects/global/footer'
import header from './objects/global/header'
import linkExternal from './objects/global/linkExternal'
import linkInternal from './objects/global/linkInternal'
import linkSocial from './objects/global/linkSocial'
import inventory from './objects/shopify/inventory'
import links from './objects/global/links'
import notFoundPage from './objects/global/notFoundPage'
import heroCollection from './objects/hero/collection'
import heroHome from './objects/hero/home'
import heroAbout from './objects/hero/about'
import heroPage from './objects/hero/page'
import moduleAccordion from './objects/module/accordion'
import accordionBody from './objects/module/accordionBody'
import accordionGroup from './objects/module/accordionGroup'
import moduleGrid from './objects/module/grid'
import moduleCard from './objects/module/card'
import gridItems from './objects/module/gridItem'
import menu from './objects/global/menu'
import seo from './objects/seo/seo'
import seoHome from './objects/seo/home'
import seoPage from './objects/seo/page'
import seoShopify from './objects/seo/shopify'
import seoDescription from './objects/seo/description'
import video from './objects/module/video'
import category from './taxonomies/categories'
import moduleProduct from './objects/module/product'
import moduleProducts from './objects/module/products'
import priceRange from './objects/shopify/priceRange'
import option from './objects/shopify/option'
import productWithVariant from './objects/shopify/productWithVariant'
import shopifyCollection from './objects/shopify/shopifyCollection'
import shopifyCollectionRule from './objects/shopify/shopifyCollectionRule'
import shopifyProduct from './objects/shopify/shopifyProduct'
import shopifyProductVariant from './objects/shopify/shopifyProductVariant'
import characteristic from './objects/module/characteristic'
import customProductOptionColor from './objects/customProductOption/color'
import customProductOptionColorObject from './objects/customProductOption/colorObject'

// Collections
import collectionGroup from './objects/collection/group'
import collectionLinks from './objects/collection/links'


const objects = [
  footer,
  header,
  links,
  linkExternal,
  linkInternal,
  linkSocial,
  notFoundPage,
  heroHome,
  heroAbout,
  heroPage,
  moduleAccordion,
  accordionBody,
  accordionGroup,
  menu,
  moduleCard,
  moduleGrid,
  gridItems,
  seo,
  seoHome,
  seoPage,
  seoDescription,
  category,
  video,
  moduleProduct,
  moduleProducts,
  priceRange,
  option,
  productWithVariant,
  shopifyCollection,
  shopifyCollectionRule,
  shopifyProduct,
  shopifyProductVariant,
  collectionGroup,
  collectionLinks,
  inventory,
  heroCollection,
  seoShopify,
  modulePage,
  characteristic,
  customProductOptionColor,
  customProductOptionColorObject,
]

export const schemaTypes = [...annotations, ...singletons, ...objects, ...blocks, ...documents]
