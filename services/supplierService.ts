import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/config/endpoints";
import { unwrapApiPayload } from "@/utils/authHelpers";
import { unwrapPaginatedResult } from "@/utils/catalogHelpers";
import type {
  ApiSupplier,
  SupplierListParams,
  SupplierListResult,
} from "@/types/supplier";

function pickString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

function pickNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function normalizeSupplier(raw: unknown): ApiSupplier | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const company = readRecord(item.company);
  const contact = readRecord(item.contact);
  const user = readRecord(item.user);
  const location = readRecord(item.location) ?? readRecord(item.address);
  // business_type can be a string or `{ name: "..." }`
  const businessTypeRecord = readRecord(item.business_type);

  const id = pickNumber(item.id);
  const companyName =
    pickString(item.company_name) ??
    pickString(item.name) ??
    pickString(item.business_name) ??
    pickString(company?.name) ??
    pickString(company?.company_name);
  if (id == null || !companyName) return null;

  const businessType =
    pickString(item.business_type) ??
    pickString(businessTypeRecord?.name) ??
    pickString(company?.business_type) ??
    pickString(readRecord(company?.business_type)?.name);

  const mobileNumber =
    pickString(item.mobile_number) ??
    pickString(item.mobile) ??
    pickString(contact?.mobile_number) ??
    pickString(contact?.mobile) ??
    pickString(user?.mobile_number) ??
    pickString(user?.mobile);

  const phone =
    pickString(item.phone) ??
    pickString(contact?.phone) ??
    pickString(user?.phone) ??
    pickString(company?.phone);

  const whatsapp =
    pickString(item.whatsapp) ??
    pickString(contact?.whatsapp) ??
    pickString(company?.whatsapp);

  const email =
    pickString(item.email) ??
    pickString(contact?.email) ??
    pickString(user?.email) ??
    pickString(company?.email);

  return {
    id,
    user_id:
      pickNumber(item.user_id) ??
      pickNumber(user?.id) ??
      pickNumber(user?.user_id),
    company_name: companyName,
    industry:
      pickString(item.industry) ??
      pickString(company?.industry),
    business_type: businessType,
    logo:
      pickString(item.logo) ??
      pickString(company?.logo),
    verified: item.verified === true || company?.verified === true,
    rating: pickNumber(item.rating),
    response_rate: pickNumber(item.response_rate),
    years_in_business: pickNumber(item.years_in_business),
    profile_views_count: pickNumber(item.profile_views_count),
    product_count: pickNumber(item.product_count),
    latitude: pickNumber(item.latitude) ?? pickNumber(location?.latitude),
    longitude: pickNumber(item.longitude) ?? pickNumber(location?.longitude),
    city:
      pickString(item.city) ??
      pickString(location?.city) ??
      pickString(company?.city),
    state:
      pickString(item.state) ??
      pickString(location?.state) ??
      pickString(company?.state),
    is_active: typeof item.is_active === "boolean" ? item.is_active : null,
    mobile_number: mobileNumber,
    phone,
    whatsapp,
    email,
  };
}

/** GET /api/v1/suppliers/:id — seller profile details */
export async function fetchSupplierById(id: number): Promise<ApiSupplier> {
  const response = await apiClient.get(`${API_ENDPOINTS.SUPPLIERS}/${id}`);
  const data = unwrapApiPayload<unknown>(response.data);
  const supplier = normalizeSupplier(data);
  if (!supplier) {
    throw new Error("Seller details could not be loaded");
  }
  return supplier;
}

/** GET /api/v1/suppliers — searchable seller list for private RFQs */
export async function fetchSuppliers(
  params?: SupplierListParams
): Promise<SupplierListResult> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const response = await apiClient.get(API_ENDPOINTS.SUPPLIERS, {
    params: {
      page,
      limit,
      sort_by: params?.sort_by ?? "company_name",
      sort_order: params?.sort_order ?? "asc",
      ...(params?.search?.trim() ? { search: params.search.trim() } : {}),
    },
  });
  const data = unwrapApiPayload<unknown>(response.data);
  const paginated = unwrapPaginatedResult<unknown>(data);
  const results = paginated.results
    .map(normalizeSupplier)
    .filter((s): s is ApiSupplier => s !== null);

  return {
    results,
    pagination: {
      ...paginated.pagination,
      page: paginated.pagination.page || page,
      limit: paginated.pagination.limit || limit,
    },
  };
}
