/**
 * Client calls same-origin `/api/v1` — Next.js rewrites proxy to the real API (avoids CORS).
 * Override with NEXT_PUBLIC_API_BASE_URL for direct API access (e.g. mobile apps).
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";
