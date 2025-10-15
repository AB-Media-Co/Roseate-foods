import { shopify } from "../lib/shopify";
import {
  GET_PRODUCTS,
  CREATE_CART,
  UPDATE_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_LINES,
  GET_CART_BY_ID,
  GET_COLLECTION_BY_HANDLE,
  GET_COLLECTIONS,
  GET_PAGE_BY_HANDLE,
} from "../graphql/queries";

export async function apiGetProducts(first) {
  const data = await shopify.request(GET_PRODUCTS, { first });
  console.log("Products data:", data); // Debugging line
  return data.products?.edges?.map((e) => e.node) ?? [];
}

export async function apiCreateCart(input = {}) {
  const data = await shopify.request(CREATE_CART, { input });
  const payload = data.cartCreate;
  if (payload.userErrors?.length) {
    throw new Error(payload.userErrors[0].message || "Cart create failed");
  }
  return payload.cart;
}

export async function apiCartLinesAdd(cartId, lines) {
  const data = await shopify.request(UPDATE_CART, { cartId, lines });
  const payload = data.cartLinesAdd;
  if (payload.userErrors?.length) {
    throw new Error(payload.userErrors[0].message || "Add to cart failed");
  }
  return payload.cart;
}

export async function apiCartLinesRemove(cartId, lineIds) {
  const data = await shopify.request(REMOVE_FROM_CART, { cartId, lineIds });
  const payload = data.cartLinesRemove;
  if (payload.userErrors?.length) {
    throw new Error(payload.userErrors[0].message || "Remove from cart failed");
  }
  return payload.cart;
}

export async function apiCartLinesUpdate(cartId, lines) {
  const data = await shopify.request(UPDATE_CART_LINES, { cartId, lines });
  const payload = data.cartLinesUpdate;
  if (payload.userErrors?.length) {
    throw new Error(payload.userErrors[0].message || "Update cart failed");
  }
  return payload.cart;
}

export async function apiGetCartById(id) {
  const data = await shopify.request(GET_CART_BY_ID, { id });
  console.log(data,"gagag")
  return data.cart;
}



export async function apiGetCollections(first = 50, after) {
  const data = await shopify.request(GET_COLLECTIONS, { first, after });
  const conn = data.collections ?? { edges: [], pageInfo: {} };
  return {
    items: conn.edges.map(e => e.node),   // no productsCount here
    pageInfo: conn.pageInfo,
  };
}

export async function apiGetCollectionByHandle(handle, productsFirst = 50, productsAfter) {
  const data = await shopify.request(GET_COLLECTION_BY_HANDLE, {
    handle,
    productsFirst,
    productsAfter,
  });

  const c = data.collectionByHandle;
  if (!c) return null;

  return {
    id: c.id,
    handle: c.handle,
    title: c.title,
    description: c.description,
    image: c.image,
    products: c.products.edges.map(e => e.node),
    productsPageInfo: c.products.pageInfo,
  };
}


export async function fetchPageByHandle(handle) {
  const data = await shopify.request(GET_PAGE_BY_HANDLE, { handle });
  return data.page;
}