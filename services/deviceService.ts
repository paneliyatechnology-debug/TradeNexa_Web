import apiClient from "@/services/apiClient";
import { API_ENDPOINTS, authDeviceDeleteEndpoint } from "@/config/endpoints";
import { unwrapApiPayload } from "@/utils/authHelpers";

export interface LoginDevice {
  id: number | string;
  title: string;
  browser: string;
  os: string;
  device_type: "desktop" | "mobile" | "tablet";
  ip_address: string;
  login_at: string;
  last_active: string;
  is_current: boolean;
}

function parseDevice(item: unknown): LoginDevice | null {
  if (!item || typeof item !== "object") return null;
  const rec = item as Record<string, unknown>;

  const id = rec.id != null ? String(rec.id) : "";
  if (!id) return null;

  const browser = typeof rec.browser === "string" ? rec.browser : "Web Browser";
  const os = typeof rec.os === "string" ? rec.os : "Unknown OS";
  const title = typeof rec.title === "string" ? rec.title : `${browser} on ${os}`;
  const device_type =
    rec.device_type === "mobile" || rec.device_type === "tablet" ? rec.device_type : "desktop";
  const ip_address = typeof rec.ip_address === "string" ? rec.ip_address : "Unknown IP";
  const login_at = typeof rec.login_at === "string" ? rec.login_at : new Date().toISOString();
  const last_active = typeof rec.last_active === "string" ? rec.last_active : login_at;
  const is_current = Boolean(rec.is_current);

  return {
    id,
    title,
    browser,
    os,
    device_type,
    ip_address,
    login_at,
    last_active,
    is_current,
  };
}

/**
 * Fetch all active login devices / sessions for the authenticated user.
 */
export async function fetchActiveDevices(): Promise<LoginDevice[]> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.AUTH_DEVICES);
    const data = unwrapApiPayload<unknown>(response.data);

    if (Array.isArray(data)) {
      return data.map(parseDevice).filter((d): d is LoginDevice => d !== null);
    }

    if (data && typeof data === "object" && "results" in data && Array.isArray((data as { results: unknown[] }).results)) {
      return (data as { results: unknown[] }).results
        .map(parseDevice)
        .filter((d): d is LoginDevice => d !== null);
    }

    return [];
  } catch (error) {
    console.error("[DeviceService] Failed to fetch login devices:", error);
    throw error;
  }
}

/**
 * Log out / revoke a specific device session.
 */
export async function logoutDevice(deviceId: number | string): Promise<boolean> {
  try {
    const response = await apiClient.delete(authDeviceDeleteEndpoint(deviceId));
    const data = unwrapApiPayload<unknown>(response.data);
    return Boolean(data !== undefined);
  } catch (error) {
    console.error("[DeviceService] Failed to logout device:", error);
    throw error;
  }
}

/**
 * Log out all devices except the current active session.
 */
export async function logoutAllDevices(): Promise<boolean> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH_DEVICES_LOGOUT_ALL);
    const data = unwrapApiPayload<unknown>(response.data);
    return Boolean(data !== undefined);
  } catch (error) {
    console.error("[DeviceService] Failed to logout all devices:", error);
    throw error;
  }
}
