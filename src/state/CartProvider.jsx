import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiCreateCart,
  apiGetCartById,
  apiCartLinesAdd,
  apiCartLinesRemove,
  apiCartLinesUpdate,
} from "../api/storefront";

const CartCtx = createContext(null);
const CART_KEY = "sf_cart_id";

export function CartProvider({ children }) {
  const qc = useQueryClient();
  const [cartId, setCartId] = useState(() => localStorage.getItem(CART_KEY) || null);

  const { data: cart } = useQuery({
    queryKey: ["cart", cartId],
    queryFn: () => apiGetCartById(cartId),
    enabled: !!cartId,
    staleTime: 60_000,
  });

  const createCart = useMutation({
    mutationFn: () => apiCreateCart({}),
    onSuccess: (cart) => {
      localStorage.setItem(CART_KEY, cart.id);
      setCartId(cart.id);
      qc.setQueryData(["cart", cart.id], cart);
    },
  });

  const addLines = useMutation({
    mutationFn: ({ lines }) => {
      const id = cartId ?? localStorage.getItem(CART_KEY);
      if (!id) throw new Error("No cart yet");
      return apiCartLinesAdd(id, lines);
    },
    onSuccess: (next) => qc.setQueryData(["cart", next.id], next),
  });

  const removeLines = useMutation({
    mutationFn: ({ lineIds }) => apiCartLinesRemove(cartId, lineIds),
    onSuccess: (next) => qc.setQueryData(["cart", next.id], next),
  });

  const updateLines = useMutation({
    mutationFn: ({ lines }) => apiCartLinesUpdate(cartId, lines),
    onSuccess: (next) => qc.setQueryData(["cart", next.id], next),
  });

  const value = useMemo(
    () => ({
      cart,
      cartId,
      ensureCart: async () => {
        if (cartId) return cartId;
        const created = await createCart.mutateAsync();
        return created.id;
      },
      addToCart: async (variantId, quantity = 1) => {
        const id = await (cartId ? cartId : (async () => (await createCart.mutateAsync()).id)());
        return addLines.mutateAsync({
          lines: [{ merchandiseId: variantId, quantity }],
        });
      },
      removeFromCart: (lineId) => removeLines.mutateAsync({ lineIds: [lineId] }),
      updateCartQty: (lineId, quantity) =>
        updateLines.mutateAsync({ lines: [{ id: lineId, quantity }] }),
      checkoutUrl: cart?.checkoutUrl,
      totalQuantity: cart?.totalQuantity || 0,
      isLoading:
        createCart.isPending || addLines.isPending || removeLines.isPending || updateLines.isPending,
      isCreating: createCart.isPending,
      error:
        createCart.error || addLines.error || removeLines.error || updateLines.error || null,
    }),
    [cart, cartId, createCart, addLines, removeLines, updateLines]
  );

  // Keep localStorage in sync if cart id changes externally
  useEffect(() => {
    if (cartId) localStorage.setItem(CART_KEY, cartId);
  }, [cartId]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
