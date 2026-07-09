import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/config/endpoints";
import { unwrapApiPayload } from "@/utils/authHelpers";
import type { ApiProductListItem } from "@/types/catalog";
import type { WishlistListParams, WishlistListResult, WishlistToggleResponse } from "@/types/wishlist";
import { normalizeWishlistEntry, unwrapWishlistListPayload } from "@/utils/wishlistHelpers";

function buildWishlistParams(params?: WishlistListParams) {
  return {
    page: params?.page ?? 1,
    limit: params?.limit ?? 20,
    search: params?.search ?? "",
  };
}

/** GET /api/v1/wishlist — paginated wishlist products (requires auth). */
export async function fetchWishlist(params?: WishlistListParams): Promise<WishlistListResult> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;

  const response = await apiClient.get(API_ENDPOINTS.WISHLIST, {
    params: buildWishlistParams(params),
  });
  const data = unwrapApiPayload<unknown>(response.data);
  const paginated = unwrapWishlistListPayload(data, page, limit);
  const results = paginated.results
    .map(normalizeWishlistEntry)
    .filter((item): item is ApiProductListItem => item !== null);

  const total =
    paginated.pagination.total > 0 ? paginated.pagination.total : results.length;

  return {
    pagination: {
      ...paginated.pagination,
      total,
      totalPages:
        paginated.pagination.totalPages > 0
          ? paginated.pagination.totalPages
          : total > 0
            ? Math.max(1, Math.ceil(total / limit))
            : 0,
    },
    results,
  };
}

/** POST /api/v1/wishlist/toggle — add/remove product from wishlist. */
export async function toggleWishlistApi(
  productId: number,
  currentlyWishlisted?: boolean
): Promise<boolean> {
  const response = await apiClient.post(API_ENDPOINTS.WISHLIST_TOGGLE, {
    product_id: productId,
  });
  const data = unwrapApiPayload<WishlistToggleResponse>(response.data);

  if (typeof data.is_wishlist === "boolean") return data.is_wishlist;
  if (typeof data.is_favourite === "boolean") return data.is_favourite;
  if (currentlyWishlisted !== undefined) return !currentlyWishlisted;

  return true;
}
