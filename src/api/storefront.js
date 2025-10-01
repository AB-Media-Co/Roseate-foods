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
} from "../graphql/queries";

export async function apiGetProducts(first) {
  const data = await shopify.request(GET_PRODUCTS, { first });
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
  return data.cart;
}


export async function apiGetCollections(first = 20, after = null) {
  const data = await shopify.request(GET_COLLECTIONS, { first, after });
  return data.collections?.edges?.map(e => e.node) ?? [];
}

export async function apiGetCollectionByHandle(handle, first = 20, after = null) {
  const data = await shopify.request(GET_COLLECTION_BY_HANDLE, { handle, first, after });
  return data.collection; // includes products connection
}