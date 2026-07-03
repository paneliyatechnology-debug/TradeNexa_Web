/**
 * Client uses same-origin `/api/v1` (proxied to Railway) to avoid CORS on Vercel/production.
 * Override NEXT_PUBLIC_API_BASE_URL only if you have backend CORS for your domain.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

/** Railway backend origin (server-side proxy target) */
export const BACKEND_ORIGIN = (
  process.env.API_PROXY_TARGET?.trim() ||
  "https://tradenexabackend-production.up.railway.app"
).replace(/\/$/, "");
