import { useQuery } from "@tanstack/react-query";
import { apiGetProducts } from "../api/storefront";

export function useProducts(first = 12) {
  return useQuery({
    queryKey: ["products", first],
    queryFn: () => apiGetProducts(first),
    staleTime: 60_000,
  });
}
