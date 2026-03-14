import { GraphQLClient } from 'graphql-request'

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESSTOKEN

export async function shopifyData(query, variables) {
  const endpoint = `https://${domain}/api/2024-10/graphql.json`

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
  })

  return await graphQLClient.request(query, variables)
}

// ─── Cart API (replaces deprecated Checkout API) ──────────────────────────────

export async function createCart(variantId, quantity) {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const response = await shopifyData(query, {
    input: {
      lines: [{ merchandiseId: variantId, quantity }],
    },
  })

  return response.cartCreate.cart ?? null
}

export async function updateCart(cartId, lineItems) {
  // First get current cart lines to map GIDs
  const cart = await getCart(cartId)
  const existingLines = cart?.lines?.edges?.map(({ node }) => node) ?? []

  // Build a map of variantId → lineId for existing items
  const lineMap = {}
  existingLines.forEach((line) => {
    lineMap[line.merchandise.id] = line.id
  })

  // Split into lines to add, update, or remove
  const linesToAdd = []
  const linesToUpdate = []
  const newVariantIds = new Set()

  lineItems.forEach((item) => {
    const variantId = item.store?.gid
    if (!variantId) return
    newVariantIds.add(variantId)

    if (lineMap[variantId]) {
      linesToUpdate.push({ id: lineMap[variantId], quantity: item.variantQuantity })
    } else {
      linesToAdd.push({ merchandiseId: variantId, quantity: item.variantQuantity })
    }
  })

  // Lines to remove (in cart but not in new state)
  const linesToRemove = existingLines
    .filter((line) => !newVariantIds.has(line.merchandise.id))
    .map((line) => line.id)

  let updatedCart = cart

  if (linesToRemove.length > 0) {
    updatedCart = await removeLinesFromCart(cartId, linesToRemove)
  }
  if (linesToUpdate.length > 0) {
    updatedCart = await updateLinesInCart(cartId, linesToUpdate)
  }
  if (linesToAdd.length > 0) {
    updatedCart = await addLinesToCart(cartId, linesToAdd)
  }

  return updatedCart
}

async function addLinesToCart(cartId, lines) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `
  const response = await shopifyData(query, { cartId, lines })
  return response.cartLinesAdd.cart
}

async function updateLinesInCart(cartId, lines) {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `
  const response = await shopifyData(query, { cartId, lines })
  return response.cartLinesUpdate.cart
}

async function removeLinesFromCart(cartId, lineIds) {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `
  const response = await shopifyData(query, { cartId, lineIds })
  return response.cartLinesRemove.cart
}

async function getCart(cartId) {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
            }
          }
        }
      }
    }
  `
  const response = await shopifyData(query, { cartId })
  return response.cart
}

// ─── Products ──────────────────────────────────────────────────────────────────

export async function getProductByHandle(handle) {
  const query = `
    {
      product(handle: "${handle}") {
        id
        title
        handle
        descriptionHtml
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              image {
                url
                altText
              }
            }
          }
        }
        options {
          name
          values
        }
      }
    }
  `

  const response = await shopifyData(query)
  return response?.product ?? null
}

export async function getAllProducts() {
  const query = `
    {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              url
              altText
            }
          }
        }
      }
    }
  `

  const response = await shopifyData(query)
  return response.products.edges.map(({ node }) => node)
}

export async function login(email, password) {
  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `

  try {
    const response = await shopifyData(query, { input: { email, password } })
    return response
  } catch (err) {
    return { error: err }
  }
}

export async function getUser(token) {
  const query = `
    {
      customer(customerAccessToken: "${token}") {
        id
        firstName
        lastName
        acceptsMarketing
        email
        orders(first: 10) {
          edges {
            node {
              id
              name
              orderNumber
              totalPrice { amount }
              processedAt
              statusUrl
              lineItems(first: 250) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      id
                      title
                      price { amount }
                      image { src altText }
                      product { id handle }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  try {
    const response = await shopifyData(query)
    return response
  } catch (err) {
    return { error: err }
  }
}

const resetPassword = async (id, resetToken, newPassword) => {
  const query = `
    mutation {
      customerReset(id: "gid://shopify/Customer/${id}", input: {resetToken: "${resetToken}", password: "${newPassword}"}) {
        customer { id }
        customerAccessToken { accessToken }
        customerUserErrors { message }
      }
    }
  `

  try {
    const response = await shopifyData(query)
    if (response.customerReset.customerUserErrors.length === 0) {
      return { success: true }
    }
    return { success: false, message: response.customerReset.customerUserErrors[0].message }
  } catch (error) {
    return { success: false, message: error }
  }
}

export { resetPassword }
