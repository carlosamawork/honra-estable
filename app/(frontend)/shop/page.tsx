import { getShopProducts } from '@/sanity/queries/queries/shop'
import { ShopPage } from '@/components/ShopPage'

export const revalidate = 60

export default async function Shop() {
  const products = await getShopProducts()

  return <ShopPage products={products} />
}
