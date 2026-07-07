'use client'
import { createContext, useState, useEffect } from 'react'
import { createCart, updateCart } from '../lib/shopify'

const CartContext = createContext()

export default function ShopProvider({ children }) {
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [cartId, setCartId] = useState('')
  const [checkoutUrl, setCheckoutUrl] = useState('')
  const [pageIsLoaded, setPageIsLoaded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  function handleDocumentClick(e) {
    const cartEl = document.getElementById('cart-slide')
    if (cartEl && e.target !== cartEl && !cartEl.contains(e.target)) {
      setCartOpen(false)
    }
  }

  useEffect(() => {
    if (localStorage.checkout_id) {
      try {
        const cartObject = JSON.parse(localStorage.checkout_id)
        const items = cartObject[0]
        const cartData = cartObject[1]

        if (Array.isArray(items) && items.length > 0) {
          setCart(items)
        } else if (items?.id) {
          setCart([items])
        }

        if (cartData?.id) setCartId(cartData.id)
        if (cartData?.checkoutUrl) setCheckoutUrl(cartData.checkoutUrl)
      } catch {
        localStorage.removeItem('checkout_id')
      }
    }

    document.addEventListener('click', handleDocumentClick, true)
    return () => document.removeEventListener('click', handleDocumentClick, true)
  }, [])

  async function changePageIsLoaded() {
    setPageIsLoaded(true)
  }

  async function addToCart(newItem, quantity, productId, title, image) {
    const enriched = { ...newItem, title, productId, variantQuantity: quantity, image }

    if (cart.length === 0) {
      setCartOpen(true)
      setCart([enriched])

      const shopifyCart = await createCart(newItem.store.gid, quantity)
      if (!shopifyCart) return

      setCartId(shopifyCart.id)
      setCheckoutUrl(shopifyCart.checkoutUrl)
      localStorage.setItem('checkout_id', JSON.stringify([[enriched], shopifyCart]))
    } else {
      setIsOpen(true)

      let newCart
      const existingIndex = cart.findIndex((item) => item.store?.gid === newItem.store?.gid)

      if (existingIndex >= 0) {
        newCart = cart.map((item, i) =>
          i === existingIndex
            ? { ...item, variantQuantity: item.variantQuantity + quantity }
            : item
        )
      } else {
        newCart = [...cart, enriched]
      }

      setCart(newCart)
      const shopifyCart = await updateCart(cartId, newCart)
      if (!shopifyCart) return

      setCheckoutUrl(shopifyCart.checkoutUrl)
      localStorage.setItem('checkout_id', JSON.stringify([newCart, shopifyCart]))
    }
  }

  async function updateCartItem(newItem, quantity) {
    const updatedCart = cart.map((item) =>
      item.store?.gid === newItem.store?.gid ? { ...item, variantQuantity: quantity } : item
    )

    setCart(updatedCart)
    const shopifyCart = await updateCart(cartId, updatedCart)
    if (!shopifyCart) return

    setCheckoutUrl(shopifyCart.checkoutUrl)
    localStorage.setItem('checkout_id', JSON.stringify([updatedCart, shopifyCart]))
  }

  // Recibe el GID de la variante — un mismo producto puede estar en el carrito
  // en varios colores y solo debe eliminarse la variante indicada
  async function removeCartItem(variantGidToRemove) {
    const updatedCart = cart.filter((item) => item.store?.gid !== variantGidToRemove)

    setCart(updatedCart)

    if (updatedCart.length === 0) {
      setCartId('')
      setCheckoutUrl('')
      localStorage.removeItem('checkout_id')
      return
    }

    const shopifyCart = await updateCart(cartId, updatedCart)
    if (!shopifyCart) return

    setCheckoutUrl(shopifyCart.checkoutUrl)
    localStorage.setItem('checkout_id', JSON.stringify([updatedCart, shopifyCart]))
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        isOpen,
        setIsOpen,
        addToCart,
        checkoutUrl,
        removeCartItem,
        updateCartItem,
        changePageIsLoaded,
        pageIsLoaded,
        menuOpen,
        setMenuOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

const ShopConsumer = CartContext.Consumer

export { ShopConsumer, CartContext }
