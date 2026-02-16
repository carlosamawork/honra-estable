// Rich text annotations used in the block content editor
import annotationLinkEmail from './annotations/linkEmail'
import annotationLinkExternal from './annotations/linkExternal'
import annotationLinkInternal from './annotations/linkInternal'

const annotations = [
  annotationLinkEmail,
  annotationLinkExternal,
  annotationLinkInternal,
]

// Document types
import page from './documents/page'


const documents = [page,]

// Singleton document types
import home from './singletons/home'
import settings from './singletons/settings'

const singletons = [home, settings]

// Block content
import body from './blocks/body'
import bodySimple from './blocks/bodySimple'
import bodyTextTerms from './blocks/bodyTextTerms'

const blocks = [body, bodySimple, bodyTextTerms]

// Object types
import footer from './objects/global/footer'
import header from './objects/global/header'
import linkExternal from './objects/global/linkExternal'
import linkInternal from './objects/global/linkInternal'
import linkSocial from './objects/global/linkSocial'

import links from './objects/global/links'
import notFoundPage from './objects/global/notFoundPage'
import heroHome from './objects/hero/home'
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
import seoDescription from './objects/seo/description'
import video from './objects/module/video'
import category from './taxonomies/categories'

const objects = [
  footer,
  header,
  links,
  linkExternal,
  linkInternal,
  linkSocial,
  notFoundPage,
  heroHome,
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
]

export const schemaTypes = [...annotations, ...singletons, ...objects, ...blocks, ...documents]
