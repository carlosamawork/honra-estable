import { defineField } from 'sanity'

export default defineField({
  name: 'labelSettings',
  title: 'Interface labels',
  type: 'object',
  options: {
    collapsed: false,
    collapsible: true,
  },
  fields: [
    defineField({
      name: 'cart',
      title: 'Cart button',
      description: 'Header button. The item count is added automatically.',
      type: 'string',
    }),
    defineField({
      name: 'addToCart',
      title: 'Add to cart button',
      type: 'string',
    }),
    defineField({
      name: 'soldOut',
      title: 'Sold out button',
      type: 'string',
    }),
    defineField({
      name: 'cartEmpty',
      title: 'Empty cart message',
      type: 'string',
    }),
    defineField({
      name: 'quantity',
      title: 'Quantity label',
      description: 'Shown next to the quantity selector in the cart.',
      type: 'string',
    }),
    defineField({
      name: 'checkout',
      title: 'Checkout button',
      type: 'string',
    }),
  ],
})
