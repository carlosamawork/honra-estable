'use client'
import {createContext, useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'
import {createCheckout, updateCheckout} from '../lib/shopify'

const CartContext = createContext()

export default function ShopProvider({children}) {
    const [cart, setCart] = useState([])
    const [cartOpen, setCartOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [checkoutId, setCheckoutId] = useState('')
    const [checkoutUrl, setCheckoutUrl] = useState('')

    const [pageIsLoaded, setPageIsLoaded] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    const router = useRouter();
    function handleDocumentClick (e) {
        let cart = document.getElementById('cart-slide');

        if (cart && e.target !== cart && !cart.contains(e.target)) {
            setCartOpen(false);
        }
    }
    
    
    useEffect(() => {
        if (localStorage.checkout_id) {
            const cartObject = JSON.parse(localStorage.checkout_id)

            if (cartObject[0].id) {
                setCart([cartObject[0]])
            } else if (cartObject[0].length > 0) {
                setCart(...[cartObject[0]])
            }

            setCheckoutId(cartObject[1].id)
            setCheckoutUrl(cartObject[1].webUrl)
        }

        document.addEventListener('click', handleDocumentClick, true);
        return () => {
            document.removeEventListener('click', handleDocumentClick, true);
        };
    }, [])

    async function changePageIsLoaded() {
        setPageIsLoaded(true)  
    }

    async function addToCart(newItem, quantity, productId, title, image) {
        if (cart.length === 0) {
            if (quantity > 1) {
                setIsOpen(true)
            } else {
                setCartOpen(true)
            }

            newItem.title = title
            newItem.productId = productId
            newItem.variantQuantity = quantity
            newItem.image = image
            setCart([newItem])

            const checkout = await createCheckout(newItem.store.gid, quantity)

            setCheckoutId(checkout.id)
            setCheckoutUrl(checkout.webUrl)

            localStorage.setItem('checkout_id', JSON.stringify([newItem, checkout]))
        } else {
            setIsOpen(true)
            let newCart = [...cart]

            cart.map((item) => {
                if (item.store.gid === newItem.store.gid) {
                    item.variantQuantity = item.variantQuantity + quantity
                    newCart = [...cart]
                } else {
                    newItem.title = title
                    newItem.productId = productId
                    newItem.variantQuantity = quantity
                    newItem.image = image
                    newCart = [...cart, newItem]
                }
            })

            setCart(newCart)
            const newCheckout = await updateCheckout(checkoutId, newCart)
            localStorage.setItem('checkout_id', JSON.stringify([newCart, newCheckout]))
        }
    }

    async function updateCartItem(newItem, quantity) {
        let updatedCart = [...cart]

        cart.map((item) => {
            if (item.store.gid === newItem.store.gid) {
                item.variantQuantity = quantity
                updatedCart = [...cart]
            }
        })

        setCart(updatedCart)

        const newCheckout = await updateCheckout(checkoutId, updatedCart)

        localStorage.setItem('checkout_id', JSON.stringify([updatedCart, newCheckout]))
    }

    async function removeCartItem(itemToRemove) {
        const updatedCart = cart.filter((item) => item.productId !== itemToRemove)

        setCart(updatedCart)

        const newCheckout = await updateCheckout(checkoutId, updatedCart)

        localStorage.setItem('checkout_id', JSON.stringify([updatedCart, newCheckout]))
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

export {ShopConsumer, CartContext}
