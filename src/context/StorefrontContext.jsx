// src/context/StorefrontContext.jsx
import React, {
    createContext,
    useContext,
    useMemo,
    useCallback,
    useEffect,
    useRef,
    useState,
  } from "react";
  import {
    useProducts,
    useCollections,
    useInfiniteCollections,
    useCollection,
  } from "../hooks/useProducts";
  
  // 🧩 Cart API (the functions you already have)
  import {
    apiCreateCart,
    apiCartLinesAdd,
    apiCartLinesRemove,
    apiCartLinesUpdate,
    apiGetCartById,
  } from "../api/storefront"; // <— adjust path if different (e.g. "../api/index" or "../api/shopify")
  
  const StorefrontContext = createContext(null);
  const CART_ID_KEY = "cart_id";
  
  export function StorefrontProvider({
    children,
    productsFirst = 12,
    collectionsFirst = 20,
    infiniteCollectionsPageSize = 20,
    selectedCollectionHandle = null,
    collectionProductsFirst = 24,
  }) {
    /* ---------------------------- Products / Collections ---------------------------- */
    const productsQ = useProducts(productsFirst);
    const collectionsQ = useCollections(collectionsFirst);
    const collectionsInfQ = useInfiniteCollections(infiniteCollectionsPageSize);
    const collectionQ = useCollection(selectedCollectionHandle, collectionProductsFirst);
  
    const loadMoreCollections = useCallback(() => {
      if (collectionsInfQ.hasNextPage && !collectionsInfQ.isFetchingNextPage) {
        return collectionsInfQ.fetchNextPage();
      }
    }, [collectionsInfQ]);
  
    const loadMoreCollectionProducts = useCallback(() => {
      if (collectionQ?.hasNextPage && !collectionQ.isFetchingNextPage) {
        return collectionQ.fetchNextPage();
      }
    }, [collectionQ]);
  
    /* ----------------------------------- Cart ----------------------------------- */
    const [cart, setCart] = useState(null);
    const [cartStatus, setCartStatus] = useState({
      isCreating: false,
      isLoading: false,
      isUpdating: false,
      error: null,
    });
    const mountedRef = useRef(false);
  
    // helpers
    const persistCartId = (id) => {
      try {
        localStorage.setItem(CART_ID_KEY, id);
      } catch {}
    };
    const readCartId = () => {
      try {
        return localStorage.getItem(CART_ID_KEY);
      } catch {
        return null;
      }
    };
  
    const ensureCart = useCallback(async () => {
      setCartStatus((s) => ({ ...s, isLoading: true, error: null }));
      try {
        const existingId = readCartId();
        if (existingId) {
          const c = await apiGetCartById(existingId);
          if (c) {
            setCart(c);
            setCartStatus((s) => ({ ...s, isLoading: false }));
            return c;
          }
        }
        // create new cart
        setCartStatus((s) => ({ ...s, isCreating: true }));
        const newCart = await apiCreateCart();
        persistCartId(newCart.id);
        setCart(newCart);
        setCartStatus({ isCreating: false, isLoading: false, isUpdating: false, error: null });
        return newCart;
      } catch (err) {
        setCartStatus({ isCreating: false, isLoading: false, isUpdating: false, error: err });
        throw err;
      }
    }, []);
  
    // initialize on mount
    useEffect(() => {
      if (mountedRef.current) return;
      mountedRef.current = true;
      ensureCart().catch(() => {});
    }, [ensureCart]);
  
    // derived
    const cartLines = useMemo(
      () => cart?.lines?.edges?.map((e) => e.node) ?? [],
      [cart]
    );
    const cartItemCount = useMemo(
      () => cartLines.reduce((sum, l) => sum + (l.quantity ?? 0), 0),
      [cartLines]
    );
    const cartSubtotal = cart?.cost?.subtotalAmount?.amount ?? null;
    const cartCurrency = cart?.cost?.subtotalAmount?.currencyCode ?? null;
  
    // actions
    const addToCart = useCallback(
      async (lines /* [{merchandiseId, quantity, attributes?, sellingPlanId?}, ...] */) => {
        if (!Array.isArray(lines) || !lines.length) return;
        setCartStatus((s) => ({ ...s, isUpdating: true, error: null }));
        try {
          const c = cart ?? (await ensureCart());
          const updated = await apiCartLinesAdd(c.id, lines);
          setCart(updated);
          setCartStatus((s) => ({ ...s, isUpdating: false }));
          return updated;
        } catch (err) {
          setCartStatus((s) => ({ ...s, isUpdating: false, error: err }));
          throw err;
        }
      },
      [cart, ensureCart]
    );
  
    const removeFromCart = useCallback(
      async (lineIds /* string[] */) => {
        if (!lineIds?.length) return;
        setCartStatus((s) => ({ ...s, isUpdating: true, error: null }));
        try {
          const c = cart ?? (await ensureCart());
          const updated = await apiCartLinesRemove(c.id, lineIds);
          setCart(updated);
          setCartStatus((s) => ({ ...s, isUpdating: false }));
          return updated;
        } catch (err) {
          setCartStatus((s) => ({ ...s, isUpdating: false, error: err }));
          throw err;
        }
      },
      [cart, ensureCart]
    );
  
    const updateCartLines = useCallback(
      async (lines /* [{id, quantity, attributes?}, ...] */) => {
        if (!lines?.length) return;
        setCartStatus((s) => ({ ...s, isUpdating: true, error: null }));
        try {
          const c = cart ?? (await ensureCart());
          const updated = await apiCartLinesUpdate(c.id, lines);
          setCart(updated);
          setCartStatus((s) => ({ ...s, isUpdating: false }));
          return updated;
        } catch (err) {
          setCartStatus((s) => ({ ...s, isUpdating: false, error: err }));
          throw err;
        }
      },
      [cart, ensureCart]
    );
  
    const refreshCart = useCallback(async () => {
      const id = readCartId();
      if (!id) return ensureCart();
      setCartStatus((s) => ({ ...s, isLoading: true, error: null }));
      try {
        const latest = await apiGetCartById(id);
        setCart(latest);
        setCartStatus((s) => ({ ...s, isLoading: false }));
        return latest;
      } catch (err) {
        setCartStatus((s) => ({ ...s, isLoading: false, error: err }));
        throw err;
      }
    }, [ensureCart]);
  
    /* --------------------------------- Value --------------------------------- */
    const value = useMemo(() => {
      // Flatten infinite results safely
      const infiniteCollections =
        collectionsInfQ.data?.pages?.flatMap((p) => p?.nodes ?? []) ?? [];
      const selectedCollection = collectionQ?.data?.pages?.[0]?.collection || null;
      const collectionProducts =
        collectionQ?.data?.pages?.flatMap((p) => p?.products ?? []) ?? [];
  
      return {
        /* Products */
        products: productsQ.data ?? [],
        productsLoading: productsQ.isLoading,
        productsError: productsQ.error,
        refetchProducts: productsQ.refetch,
  
        /* Collections (basic) */
        collections: collectionsQ.data ?? [],
        collectionsLoading: collectionsQ.isLoading,
        collectionsError: collectionsQ.error,
        refetchCollections: collectionsQ.refetch,
  
        /* Collections (infinite) */
        infiniteCollections,
        collectionsInfStatus: {
          isLoading: collectionsInfQ.isLoading,
          isFetching: collectionsInfQ.isFetching,
          isFetchingNextPage: collectionsInfQ.isFetchingNextPage,
          hasNextPage: collectionsInfQ.hasNextPage ?? false,
          error: collectionsInfQ.error,
        },
        loadMoreCollections,
  
        /* Selected collection + products (infinite) */
        selectedCollectionHandle,
        selectedCollection,
        collectionProducts,
        collectionProductsStatus: {
          isLoading: collectionQ?.isLoading ?? false,
          isFetching: collectionQ?.isFetching ?? false,
          isFetchingNextPage: collectionQ?.isFetchingNextPage ?? false,
          hasNextPage: collectionQ?.hasNextPage ?? false,
          error: collectionQ?.error ?? null,
        },
        loadMoreCollectionProducts,
        refetchCollection: collectionQ?.refetch ?? (() => Promise.resolve()),
  
        /* Cart */
        cart,
        cartLines,            // array of line nodes
        cartItemCount,        // total qty
        cartSubtotal,         // numeric string (e.g. "123.45")
        cartCurrency,         // e.g. "USD"
        cartStatus,           // { isCreating, isLoading, isUpdating, error }
  
        ensureCart,           // creates if missing, returns cart
        refreshCart,          // fetch latest
        addToCart,            // add new lines
        removeFromCart,       // remove by lineIds
        updateCartLines,      // update qty/attrs for existing lines
      };
    }, [
      /* products/collections deps */
      productsQ,
      collectionsQ,
      collectionsInfQ.data,
      collectionsInfQ.isLoading,
      collectionsInfQ.isFetching,
      collectionsInfQ.isFetchingNextPage,
      collectionsInfQ.hasNextPage,
      collectionsInfQ.error,
      loadMoreCollections,
      collectionQ?.data,
      collectionQ?.isLoading,
      collectionQ?.isFetching,
      collectionQ?.isFetchingNextPage,
      collectionQ?.hasNextPage,
      collectionQ?.error,
      collectionQ?.refetch,
      selectedCollectionHandle,
      loadMoreCollectionProducts,
      /* cart deps */
      cart,
      cartLines,
      cartItemCount,
      cartSubtotal,
      cartCurrency,
      cartStatus,
      ensureCart,
      refreshCart,
      addToCart,
      removeFromCart,
      updateCartLines,
    ]);
  
    return (
      <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>
    );
  }
  
  export function useStorefront() {
    const ctx = useContext(StorefrontContext);
    if (!ctx) {
      throw new Error("useStorefront must be used within a StorefrontProvider");
    }
    return ctx;
  }
  