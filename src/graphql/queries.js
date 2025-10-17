export const PRODUCT_CARD_FIELDS = /* GraphQL */ `
fragment ProductCardFields on Product {
  id
  handle
  title
  description
  vendor
  productType
  tags
  createdAt
  updatedAt
  availableForSale
  totalInventory

  # 1) Hero image
  featuredImage {
    url
    altText
    width
    height
  }


  # 3) Modern media gallery (images + video + externalVideo + 3D)
  media(first: 10) {
    edges {
      node {
        mediaContentType
        alt
        previewImage {
          url(transform: { preferredContentType: WEBP, maxWidth: 1600 })
          altText
          width
          height
        }
        ... on MediaImage {
          image {
            url(transform: { preferredContentType: WEBP, maxWidth: 1600 })
            altText
            width
            height
          }
        }
        ... on Video {
          sources {
            url
            mimeType
          }
        }
        ... on ExternalVideo {
          embeddedUrl
          host
        }
        ... on Model3d {
          sources {
            url
            mimeType
          }
        }
      }
    }
  }

  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { maxVariantPrice { amount currencyCode } }



  seo { title description }

  # 4) Variants (needed for Add to Cart)
  variants(first: 20) {
    edges {
      node {
        id
        title
        availableForSale
        price { amount currencyCode }
      }
    }
  }

  # Metafields (as you had)
  fssai: metafield(namespace:"legal", key:"fssai_number") { value }
  ingredients: metafield(namespace:"info", key:"ingredients") { value }
  allergens: metafield(namespace:"info", key:"allergens") { value }
  nutrition: metafield(namespace:"info", key:"nutrition_table") { value }
  mfgDate: metafield(namespace:"legal", key:"mfg_date") { value }
  expDate: metafield(namespace:"legal", key:"expiry_date") { value }
  origin: metafield(namespace:"legal", key:"country_of_origin") { value }
  netQty: metafield(namespace:"legal", key:"net_quantity") { value }

  productRating: metafield(namespace:"reviews", key:"rating") { value }
  productRatingCount: metafield(namespace:"reviews", key:"rating_count") { value }
}
`;



export const GET_PRODUCTS = /* GraphQL */ `
  ${PRODUCT_CARD_FIELDS}
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          ...ProductCardFields
        }
      }
    }
  }
`;




export const CREATE_CART = `
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    featuredImage {
                      url
                    }
                  }
                }
              }
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
`;

export const UPDATE_CART = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    featuredImage {
                      url
                    }
                  }
                }
              }
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
`;

export const REMOVE_FROM_CART = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    featuredImage {
                      url
                    }
                  }
                }
              }
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
`;

export const UPDATE_CART_LINES = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    featuredImage {
                      url
                    }
                  }
                }
              }
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
`;

export const GET_CART_BY_ID = `
  query GetCart($id: ID!) {
    cart(id: $id) {
      id
      checkoutUrl
      totalQuantity
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  id
                  title
                  featuredImage {
                    url
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


// List collections (paged)
export const GET_COLLECTIONS = `
  query GetCollections($first: Int!, $after: String) {
    collections(first: $first, after: $after, sortKey: TITLE) {
      edges {
        cursor
        node {
          id
          handle
          title
          description
          image { url altText }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

// One collection by handle + its products (paged)
export const GET_COLLECTION_BY_HANDLE = /* GraphQL */ `
  ${PRODUCT_CARD_FIELDS}
  query GetCollectionByHandle(
    $handle: String!
    $productsFirst: Int!
    $productsAfter: String
  ) {
    collectionByHandle(handle: $handle) {
      id
      handle
      title
      description
      image { url altText }
      products(first: $productsFirst, after: $productsAfter) {
        edges {
          cursor
          node {
            ...ProductCardFields
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;


export const GET_PAGE_BY_HANDLE = /* GraphQL */ `
  query GetPageByHandle($handle: String!) {
    page(handle: $handle) {
      id
      title
      handle
      body
      bodySummary
      updatedAt
      seo {
        title
        description
      }
    }
  }
`;

export const GET_ALL_MENUS = /* GraphQL */ `
  query GetAllMenus {
    mainMenu: menu(handle: "main-menu") {
      id
      title
      items {
        id
        title
        url
        type
        resource {
          __typename
          ... on Product { handle }
          ... on Collection { handle }
          ... on Page { handle }
        }
        items {
          id
          title
          url
        }
      }
    }

    footerMenu: menu(handle: "footer-menu") {
      id
      title
      items {
        id
        title
        url
        type
      }
    }

    customerAccountMenu: menu(handle: "customer-account-main-menu") {
      id
      title
      items {
        id
        title
        url
        type
      }
    }
  }
`;
