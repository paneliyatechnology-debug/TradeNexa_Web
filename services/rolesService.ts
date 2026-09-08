import apiClient from "@/services/apiClient";
import { API_ENDPOINTS } from "@/config/endpoints";
import { unwrapApiPayload } from "@/utils/authHelpers";
import { unwrapPaginatedResult } from "@/utils/catalogHelpers";
import type { ApiRole } from "@/types/roles";

export async function fetchRoles(): Promise<ApiRole[]> {
  const response = await apiClient.get(API_ENDPOINTS.ROLES);
  const data = unwrapApiPayload<unknown>(response.data);
  if (Array.isArray(data)) return data;
  const { results } = unwrapPaginatedResult<ApiRole>(data);
  return results;
}

