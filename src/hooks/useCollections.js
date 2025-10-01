import { useQuery } from "@tanstack/react-query";
import { apiGetCollectionByHandle, apiGetCollections } from "../api/storefront";

export function useCollections(first = 20, after = null) {
  return useQuery({
    queryKey: ["collections", first, after],
    queryFn: () => apiGetCollections(first, after),
    staleTime: 60 * 1000,
  });
}

export function useCollectionByHandle(handle, first = 20, after = null) {
  return useQuery({
    queryKey: ["collection", handle, first, after],
    queryFn: () => apiGetCollectionByHandle(handle, first, after),
    enabled: !!handle,
  });
}
