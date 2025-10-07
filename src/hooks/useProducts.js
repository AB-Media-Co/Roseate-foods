import { apiGetProducts } from "../api/storefront";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { apiGetCollections, apiGetCollectionByHandle } from "../api/storefront";

export function useProducts(first = 12) {
  return useQuery({
    queryKey: ["products", first],
    queryFn: () => apiGetProducts(first),
    staleTime: 60_000,
  });
}


// hooks/useCollections.js

// basic list
export function useCollections(first = 20) {
  return useQuery({
    queryKey: ["collections", first],
    queryFn: () => apiGetCollections(first),
    staleTime: 60_000,
  });
}

// infinite list (optional)
export function useInfiniteCollections(pageSize = 20) {
  return useInfiniteQuery({
    queryKey: ["collections-infinite", pageSize],
    queryFn: ({ pageParam }) => apiGetCollections(pageSize, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage?.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
    staleTime: 60_000,
  });
}

// one collection + products
export function useCollection(handle, productsFirst = 24) {
  return useInfiniteQuery({
    enabled: !!handle,
    queryKey: ["collection", handle, productsFirst],
    queryFn: ({ pageParam }) =>
      apiGetCollectionByHandle(handle, productsFirst, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage?.productsPageInfo?.hasNextPage
        ? lastPage.productsPageInfo.endCursor
        : undefined,
    staleTime: 60_000,
  });
}

