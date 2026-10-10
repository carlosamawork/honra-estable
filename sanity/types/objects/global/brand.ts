// sanity/types/objects/global/brand.ts

export type BrandImage = {
  imageUrl?: string | null
  alt?: string | null
  metadata?: { dimensions?: { width: number; height: number } } | null
}

export type BrandData = {
  logo?: BrandImage | null
  logoFooter?: BrandImage | null
  socialHandle?: string | null
  socialUrl?: string | null
  contactEmail?: string | null
}

export type CookieData = {
  title?: string | null
  text?: string | null
  privacyTitle?: string | null
  privacyText?: string | null
  privacyLinkLabel?: string | null
  privacyLinkUrl?: string | null
  acceptAllLabel?: string | null
  acceptEssentialLabel?: string | null
}

export type LabelsData = {
  cart?: string | null
  addToCart?: string | null
  soldOut?: string | null
  cartEmpty?: string | null
  quantity?: string | null
  checkout?: string | null
}

export type NotFoundData = {
  title?: string | null
  body?: unknown[] | null
}
