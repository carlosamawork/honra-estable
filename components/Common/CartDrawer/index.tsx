'use client'

import { useContext } from 'react'
import { CartContext } from '@/context/shopContext'
import s from './CartDrawer.module.scss'

const formatPrice = (value: number): string =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, checkoutUrl, removeCartItem, updateCartItem } =
    useContext(CartContext)

  const total = cart.reduce(
    (sum: number, item: any) => sum + (item.store?.price ?? 0) * (item.variantQuantity ?? 1),
    0
  )

  function handleQuantityChange(item: any, delta: number) {
    const next = item.variantQuantity + delta
    if (next <= 0) {
      removeCartItem(item.productId)
    } else {
      updateCartItem(item, next)
    }
  }

  return (
    <>
      {/* Backdrop */}
      {cartOpen && (
        <div
          className={s.backdrop}
          aria-hidden="true"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        id="cart-slide"
        className={`${s.drawer} ${cartOpen ? s.isOpen : ''}`}
        aria-label="Carrito de compra"
        aria-hidden={!cartOpen}
      >
        {/* Header */}
        <div className={s.header}>
          <button
            className={s.close}
            onClick={() => setCartOpen(false)}
            aria-label="Cerrar carrito"
          >
            ×
          </button>
          <span className={s.cartCount}>CART ({cart.length})</span>
        </div>

        {/* Items */}
        <div className={s.items}>
          {cart.length === 0 ? (
            <p className={s.empty}>Tu carrito está vacío.</p>
          ) : (
            cart.map((item: any, i: number) => (
              <article key={item.store?.gid ?? i} className={s.item}>
                {item.image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={item.image}
                    alt={item.title ?? 'Product image'}
                    className={s.itemImage}
                  />
                )}
                <div className={s.itemInfo}>
                  <span className={s.itemName}>{item.title}</span>
                  <span className={s.itemPrice}>
                    {formatPrice((item.store?.price ?? 0) * item.variantQuantity)}
                  </span>
                </div>
                <div className={s.itemInfo}>
                  <div className={s.itemQty}>
                    <span className={s.itemQtyLabel}>Cant.</span>
                    <div className={s.itemQtyControls}>
                      <button
                        onClick={() => handleQuantityChange(item, -1)}
                        aria-label="Reducir cantidad"
                      >
                        −
                      </button>
                      <button
                        onClick={() => handleQuantityChange(item, 1)}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className={s.itemQtyValue}>{item.variantQuantity}</div>
                </div>

              </article>
            ))
          )}
        </div>

        {/* Footer */}
        <div className={s.footer}>
          {checkoutUrl ? (
            <a
              href={checkoutUrl}
              className={s.checkout}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Process to checkout</span>
              <span>{formatPrice(total)}</span>
            </a>
          ) : (
            <div className={s.checkout}>
              <span>Process to checkout</span>
              <span>{formatPrice(total)}</span>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
