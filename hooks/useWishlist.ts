"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { useWishlistContext } from "@/context/WishlistContext";
import { useAuth } from "@/hooks/useAuth";
import { isPortalPath } from "@/utils/roleNavigation";

export function useWishlist() {
  const ctx = useWishlistContext();
  const { isAuthenticated, openAuthModal } = useAuth();
  const pathname = usePathname() ?? "";
  const onWebsite = !isPortalPath(pathname);

  const toggleWishlist = useCallback(
    async (productId: number, currentlyWishlisted?: boolean) => {
      if (!isAuthenticated) {
        openAuthModal("login");
        return;
      }
      await ctx.toggleWishlist(productId, currentlyWishlisted);
    },
    [ctx, isAuthenticated, openAuthModal]
  );

  const removeFromWishlist = useCallback(
    async (productId: number) => {
      if (!isAuthenticated) return;
      await ctx.removeFromWishlist(productId);
    },
    [ctx, isAuthenticated]
  );

  return {
    ...ctx,
    toggleWishlist,
    removeFromWishlist,
  };
}
