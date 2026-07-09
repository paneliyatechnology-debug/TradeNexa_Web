import type { ApiPagination, ApiProductListItem, PaginatedResult } from "@/types/catalog";
import { normalizeProductListItem, unwrapPaginatedResult } from "@/utils/catalogHelpers";

/** Parse API wishlist flags (boolean, 0/1, or string). */
export function parseWishlistFlag(value: unknown): boolean | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "boolean") return value;
  if (value === 1 || value === "1") return true;
  if (value === 0 || value === "0") return false;
  if (typeof value === "string") {
    const v = value.toLowerCase().trim();
    if (v === "true") return true;
    if (v === "false") return false;
  }
  return undefined;
}

export function readProductWishlistFlag(item: Record<string, unknown>): boolean | undefined {
  return (
    parseWishlistFlag(item.is_wishlist) ??
    parseWishlistFlag(item.is_wishlisted) ??
    parseWishlistFlag(item.is_favourite)
  );
}

/** True when the API included wishlist state (authenticated product list). */
export function productHasWishlistField(
  product: Pick<ApiProductListItem, "is_wishlist">
): boolean {
  return product.is_wishlist !== undefined;
}

function toNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function pickNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function pickString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

export function unwrapWishlistListPayload(
  payload: unknown,
  page = 1,
  limit = 20
): PaginatedResult<unknown> {
  const standard = unwrapPaginatedResult<unknown>(payload);
  if (standard.results.length > 0 || standard.pagination.total > 0) {
    return standard;
  }

  if (!payload || typeof payload !== "object") {
    return {
      results: [],
      pagination: { total: 0, page, limit, totalPages: 0 },
    };
  }

  const record = payload as Record<string, unknown>;
  const results =
    (Array.isArray(record.results) && record.results) ||
    (Array.isArray(record.items) && record.items) ||
    (Array.isArray(record.rows) && record.rows) ||
    (Array.isArray(record.data) && record.data) ||
    (Array.isArray(record.wishlist) && record.wishlist) ||
    [];

  const paginationSource =
    readRecord(record.pagination) ?? readRecord(record.meta) ?? record;

  const pageLimit = toNumber(paginationSource.limit ?? paginationSource.per_page, limit);
  const total = toNumber(
    paginationSource.total ??
      paginationSource.total_count ??
      paginationSource.totalCount ??
      paginationSource.count,
    results.length
  );
  const currentPage = toNumber(paginationSource.page ?? paginationSource.current_page, page);
  const totalPages = toNumber(
    paginationSource.totalPages ?? paginationSource.total_pages,
    pageLimit > 0 ? Math.max(1, Math.ceil(total / pageLimit)) : results.length > 0 ? 1 : 0
  );

  const pagination: ApiPagination = {
    total,
    page: currentPage,
    limit: pageLimit,
    totalPages,
  };

  return { results, pagination };
}

function mapNestedProductToListItem(
  product: Record<string, unknown>,
  wishlistRow?: Record<string, unknown>
): ApiProductListItem | null {
  const id = pickNumber(product.id) ?? pickNumber(wishlistRow?.product_id);
  const basic = readRecord(product.basic_details);
  const pricing = readRecord(product.pricing);
  const seller = readRecord(product.seller);
  const company = readRecord(seller?.company);
  const location = readRecord(seller?.location);
  const marketplace = readRecord(product.marketplace);
  const ratings = readRecord(product.ratings);
  const images = readRecord(product.images);
  const subcategory = readRecord(basic?.subcategory);

  const name =
    pickString(product.name) ??
    pickString(product.product_name) ??
    (basic ? pickString(basic.name) : null);

  const price =
    pickNumber(product.price) ??
    (pricing ? pickNumber(pricing.price ?? pricing.selling_price ?? pricing.final_price) : null);

  if (id == null || !name || price == null) return null;

  return normalizeProductListItem({
    id,
    name,
    slug: pickString(product.slug) ?? `product-${id}`,
    thumbnail:
      pickString(product.thumbnail) ??
      pickString(images?.thumbnail) ??
      pickString(images?.image) ??
      null,
    price,
    currency: pickString(product.currency) ?? (pricing ? pickString(pricing.currency) : null) ?? "INR",
    moq: pickNumber(product.moq) ?? (pricing ? pickNumber(pricing.minimum_order_quantity) : null) ?? 1,
    unit: pickString(product.unit) ?? (pricing ? pickString(pricing.unit) : null) ?? "unit",
    supplier_name:
      pickString(product.supplier_name) ?? (company ? pickString(company.name) : null) ?? "Supplier",
    verified: Boolean(product.verified ?? marketplace?.verified ?? false),
    rating: pickNumber(product.rating) ?? (ratings ? pickNumber(ratings.average_rating) : null) ?? 0,
    city: pickString(product.city) ?? (location ? pickString(location.city) : null),
    state: pickString(product.state) ?? (location ? pickString(location.state) : null),
    is_trending: Boolean(product.is_trending ?? false),
    created_at: pickString(product.created_at) ?? "",
    subcategory_id: pickNumber(product.subcategory_id) ?? pickNumber(subcategory?.id),
    subcategory_name: pickString(product.subcategory_name) ?? pickString(subcategory?.name),
    is_wishlist: true,
  });
}

function normalizeWishlistEntry(entry: unknown): ApiProductListItem | null {
  if (!entry || typeof entry !== "object") return null;
  const record = entry as Record<string, unknown>;

  const nested = readRecord(record.product);
  if (nested) {
    return mapNestedProductToListItem(nested, record);
  }

  return mapNestedProductToListItem(record, record);
}

export { normalizeWishlistEntry };
