import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
// import { getProductByExternalId } from "../api/judgemeClient";
import {
  getProductByExternalId,
  listReviews,
  createReview,
  sendManualReviewRequest,
  getProductReviewWidget,
} from "../api/judgemeClient";

export function useJudgeMeProductIdByExternalId(externalId) {
  return useQuery({
    enabled: !!externalId,
    queryKey: ["judgeme", "productByExternalId", externalId],
    queryFn: () => getProductByExternalId(externalId),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useJudgeMeReviews(productId, page = 1, perPage = 10) {
  return useQuery({
    enabled: !!productId,
    queryKey: ["judgeme", "reviews", productId, page, perPage],
    queryFn: () => listReviews({ productId, page, perPage }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}

export function useCreateJudgeMeReview() {
  return useMutation({ mutationKey: ["judgeme", "createReview"], mutationFn: createReview });
}

export function useSendManualReviewRequest() {
  return useMutation({ mutationKey: ["judgeme", "sendManualReviewRequest"], mutationFn: sendManualReviewRequest });
}

export function useJudgeMePublicWidget(productId) {
  return useQuery({
    enabled: !!productId,
    queryKey: ["judgeme", "widget", productId],
    queryFn: () => getProductReviewWidget(productId),
    staleTime: 10 * 60 * 1000,
  });
}
