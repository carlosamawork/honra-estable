import { GraphQLClient } from 'graphql-request'

const domain = process.env.SHOPIFY_STORE_DOMAIN
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESSTOKEN

export async function shopifyData(query, variables) {
  const endpoint = `https://${domain}/api/2023-07/graphql.json`
  const token = storefrontAccessToken

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      'X-Shopify-Storefront-Access-Token': token,
    }
  })

  return await graphQLClient.request(query, variables)
}

// BASIC GRAPHQL

export async function createCheckout(id, quantity) {
  const query = `
    mutation {
      checkoutCreate(input: {
        lineItems: [{variantId: "${id}", quantity: ${quantity}}]
      }) {
        checkout{
          id
          webUrl
        }
      }
    }
  `

  const response = await shopifyData(query)

  const checkout = response.checkoutCreate.checkout ? response.checkoutCreate.checkout : []

  return checkout
}

export async function updateCheckout(id, lineItems, user) {
  const lineItemsObject = lineItems.map(item => {
    return `{
      variantId: "${item.store.gid}",
      quantity: ${item.variantQuantity}
    }`
  })

  const query = `
    mutation {
      checkoutLineItemsReplace(lineItems: [${lineItemsObject}], checkoutId: "${id}") {
        checkout{
          id
          webUrl
          lineItems(first:25) {
            edges {
              node {
                id
                title
                quantity  
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const response = await shopifyData(query)

  const checkout = response.checkoutLineItemsReplace.checkout ? response.checkoutLineItemsReplace.checkout : []

  return checkout
} 

export async function login(email, password){
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
  `;

  try {
      const response = await shopifyData(query, {
          input: {
            email,
            password
          }
      });

    return response

  } catch (err) {
    return ({ error: err})
  }
}

export async function getUser(token){
  const query = `
    {
      customer(customerAccessToken: "${token}") {
        id
        firstName
        lastName
        acceptsMarketing
        email
        orders(first:10){
          edges {
            node {
              id
              name
              orderNumber
              totalPrice{
                amount
              }
              processedAt
              statusUrl
              customerUrl
              lineItems(first: 250) {  
                edges {
                  node {
                    title
                    quantity
                    variant {
                      id
                      title
                      priceV2 {
                        amount
                      }
                      image {
                        src
                        altText
                      }
                      product {
                        id
                        handle
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyData(query);

    return response

  } catch (err) {
    return ({ error: err})
  }
}

const resetPassword = async (id, resetToken, newPassword) => {
  const query = `
    mutation {
      customerReset(id: "gid://shopify/Customer/${id}", input: {resetToken: "${resetToken}", password: "${newPassword}"}) {
        customer {
          id
        }
        customerAccessToken {
            accessToken
        }
        customerUserErrors {
            message
        }
      }
    }
  `;

  try {
    const response = await shopifyData(query)

    if (response.customerReset.customerUserErrors.length === 0) {
      return { success: true };
    } else {
      return {
        success: false,
        message: response.customerReset.customerUserErrors[0].message,
      };
    }
  } catch (error) {
    return { success: false, message: error };
  }
};

export { resetPassword };


// ADDITIONAL GRAPHQL

