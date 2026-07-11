"use client";

import { resolveLocationFromCoordinates } from "@/services/locationService";
import type { ResolvedGeoLocation } from "@/types/location";

export type GeoPositionErrorCode =
  | "PERMISSION_DENIED"
  | "POSITION_UNAVAILABLE"
  | "TIMEOUT"
  | "UNSUPPORTED"
  | "UNKNOWN";

export class GeoPositionError extends Error {
  code: GeoPositionErrorCode;

  constructor(code: GeoPositionErrorCode, message: string) {
    super(message);
    this.name = "GeoPositionError";
    this.code = code;
  }
}

export function isGeolocationSupported(): boolean {
  return typeof navigator !== "undefined" && "geolocation" in navigator;
}

export async function queryBrowserGeolocationPermission(): Promise<
  PermissionState | "unsupported"
> {
  if (typeof navigator === "undefined" || !navigator.permissions?.query) {
    return "unsupported";
  }
  try {
    const result = await navigator.permissions.query({ name: "geolocation" });
    return result.state;
  } catch {
    return "unsupported";
  }
}

export function getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject(new GeoPositionError("UNSUPPORTED", "Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new GeoPositionError("PERMISSION_DENIED", error.message));
          return;
        }
        if (error.code === error.POSITION_UNAVAILABLE) {
          reject(new GeoPositionError("POSITION_UNAVAILABLE", error.message));
          return;
        }
        if (error.code === error.TIMEOUT) {
          reject(new GeoPositionError("TIMEOUT", error.message));
          return;
        }
        reject(new GeoPositionError("UNKNOWN", error.message));
      },
      {
        // Desktop Windows is unreliable with high accuracy + zero cache.
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 5 * 60_000,
        ...options,
      }
    );
  });
}

/** Get browser coords and resolve to state_id/city_id via existing location APIs. */
export async function resolveGeoLocationFromBrowser(
  options?: PositionOptions
): Promise<ResolvedGeoLocation> {
  const position = await getCurrentPosition(options);
  const { latitude, longitude } = position.coords;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new GeoPositionError("POSITION_UNAVAILABLE", "Invalid coordinates from browser");
  }

  const resolved = await resolveLocationFromCoordinates(latitude, longitude);
  if (!resolved) {
    throw new GeoPositionError(
      "POSITION_UNAVAILABLE",
      "Could not match coordinates to a known state/city"
    );
  }
  return resolved;
}
