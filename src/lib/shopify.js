import { GraphQLClient } from "graphql-request";

const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const version = import.meta.env.VITE_SHOPIFY_API_VERSION || "2024-10";

export const shopify = new GraphQLClient(
  `https://${domain}/api/${version}/graphql.json`,
  {
    headers: {
      "X-Shopify-Storefront-Access-Token": token,
      "Content-Type": "application/json",
    },
  }
);
