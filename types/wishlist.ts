import type { PaginatedResult } from "@/types/catalog";

export interface WishlistListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface WishlistToggleResponse {
  product_id?: number;
  is_wishlist?: boolean;
  is_favourite?: boolean;
  message?: string;
}

export type WishlistListResult = PaginatedResult<import("@/types/catalog").ApiProductListItem>;
