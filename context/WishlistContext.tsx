"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/hooks/useAuth";
import { fetchWishlist, toggleWishlistApi } from "@/services/wishlistService";
import type { ApiProductListItem } from "@/types/catalog";
import { showErrorToast } from "@/utils/toast";

interface WishlistContextValue {
  wishlistedIds: number[];
  wishlistTotal: number;
  isWishlisted: (productId: number, fromProduct?: boolean) => boolean;
  toggleWishlist: (productId: number, currentlyWishlisted?: boolean) => Promise<void>;
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => Promise<void>;
  syncFromProducts: (products: ApiProductListItem[], total?: number) => void;
  clearWishlist: () => void;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [wishlistMap, setWishlistMap] = useState<Record<number, boolean>>({});
  const [wishlistTotal, setWishlistTotal] = useState(0);

  const refreshWishlist = useCallback(async () => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setWishlistMap({});
      setWishlistTotal(0);
      return;
    }

    try {
      const { results, pagination } = await fetchWishlist({ page: 1, limit: 100 });
      const next: Record<number, boolean> = {};
      for (const product of results) {
        next[product.id] = true;
      }
      setWishlistMap(next);
      setWishlistTotal(pagination.total > 0 ? pagination.total : results.length);
    } catch {
      setWishlistMap({});
      setWishlistTotal(0);
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    void refreshWishlist();
  }, [authLoading, refreshWishlist]);

  const isWishlisted = useCallback(
    (productId: number, fromProduct?: boolean) => {
      if (productId in wishlistMap) {
        return wishlistMap[productId];
      }
      return fromProduct === true;
    },
    [wishlistMap]
  );

  const toggleWishlist = useCallback(async (productId: number, currentlyWishlisted?: boolean) => {
    let previous = false;

    setWishlistMap((prev) => {
      previous =
        currentlyWishlisted ?? (productId in prev ? prev[productId] : false);
      return { ...prev, [productId]: !previous };
    });
    setWishlistTotal((prev) => (previous ? Math.max(0, prev - 1) : prev + 1));

    try {
      const isWishlist = await toggleWishlistApi(productId, previous);
      setWishlistMap((prev) => ({ ...prev, [productId]: isWishlist }));

      if (isWishlist !== !previous) {
        setWishlistTotal((prev) => {
          if (isWishlist && previous) return prev + 1;
          if (!isWishlist && !previous) return Math.max(0, prev - 1);
          return prev;
        });
      }
    } catch (err) {
      setWishlistMap((prev) => ({ ...prev, [productId]: previous }));
      setWishlistTotal((prev) => (previous ? prev + 1 : Math.max(0, prev - 1)));
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to update wishlist";
      showErrorToast(message);
    }
  }, []);

  const addToWishlist = useCallback((productId: number) => {
    setWishlistMap((prev) => ({ ...prev, [productId]: true }));
  }, []);

  const removeFromWishlist = useCallback(
    async (productId: number) => {
      if (wishlistMap[productId] === false) return;

      const previous = wishlistMap[productId] ?? true;
      setWishlistMap((prev) => ({ ...prev, [productId]: false }));
      setWishlistTotal((prev) => Math.max(0, prev - 1));

      try {
        const isWishlist = await toggleWishlistApi(productId, previous);
        setWishlistMap((prev) => ({ ...prev, [productId]: isWishlist }));
        await refreshWishlist();
      } catch (err) {
        setWishlistMap((prev) => ({ ...prev, [productId]: previous }));
        setWishlistTotal((prev) => prev + 1);
        const message =
          err && typeof err === "object" && "message" in err
            ? String((err as { message: string }).message)
            : "Failed to update wishlist";
        showErrorToast(message);
      }
    },
    [refreshWishlist, wishlistMap]
  );

  const syncFromProducts = useCallback((products: ApiProductListItem[], total?: number) => {
    setWishlistMap((prev) => {
      const next = { ...prev };
      for (const product of products) {
        if (product.is_wishlist === true) {
          next[product.id] = true;
        }
      }
      return next;
    });
    if (typeof total === "number") {
      setWishlistTotal(total);
    }
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlistMap({});
    setWishlistTotal(0);
  }, []);

  const wishlistedIds = useMemo(
    () => Object.entries(wishlistMap).filter(([, v]) => v).map(([id]) => Number(id)),
    [wishlistMap]
  );

  const value = useMemo(
    () => ({
      wishlistedIds,
      wishlistTotal,
      isWishlisted,
      toggleWishlist,
      addToWishlist,
      removeFromWishlist,
      syncFromProducts,
      clearWishlist,
      refreshWishlist,
    }),
    [
      wishlistedIds,
      wishlistTotal,
      isWishlisted,
      toggleWishlist,
      addToWishlist,
      removeFromWishlist,
      syncFromProducts,
      clearWishlist,
      refreshWishlist,
    ]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlistContext() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlistContext must be used within WishlistProvider");
  }
  return ctx;
}
