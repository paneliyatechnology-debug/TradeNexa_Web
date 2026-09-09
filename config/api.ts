/**
 * ==============================================================================
 * TradeNexa Web - API & Server URL Configuration
 * ==============================================================================
 * 
 * Aap yahan se easily Local (Testing) aur Live (Production) URL switch kar sakte hain.
 * 
 * 1. DIRECT TOGGLE:
 *    Neeche diye gaye `ACTIVE_ENV` ko 'local' ya 'live' set karein.
 * 
 * 2. YA .env FILE SE:
 *    .env.local me `NEXT_PUBLIC_ENV=local` ya `NEXT_PUBLIC_ENV=live` likhein.
 */

// Available environments
export const URL_CONFIG = {
  local: {
    origin: "http://localhost:3000",
    apiUrl: "http://localhost:3000/api/v1",
  },
  live: {
    origin: "https://tradenexabackend-dev.up.railway.app",
    apiUrl: "https://tradenexabackend-dev.up.railway.app/api/v1",
  },
} as const;

export type AppEnvironment = keyof typeof URL_CONFIG;

// ==============================================================================
// ⚙️ MANUAL TOGGLE (Yahan change karke toggle kar sakte hain):
// Set to 'local' for testing, or 'live' for production
// ==============================================================================
const DEFAULT_ENV: AppEnvironment = "live"; // 👈 Change to 'live' for production

// Helper to sanitize URLs (removes trailing slashes)
function normalizeUrl(url: unknown, fallback: string): string {
  if (!url || typeof url !== "string" || !url.trim()) {
    return fallback;
  }
  let cleaned = url.trim().replace(/\/+$/, "");
  if (cleaned.includes("tradenexabackend-production.up.railway.app")) {
    cleaned = cleaned.replace("tradenexabackend-production.up.railway.app", "tradenexabackend-dev.up.railway.app");
  }
  return cleaned || fallback;
}

// Check environment variables first (allows override via .env or hosting provider)
const envOverride = process.env.NEXT_PUBLIC_ENV?.toLowerCase()?.trim() as AppEnvironment | undefined;
export const CURRENT_ENV: AppEnvironment =
  envOverride && URL_CONFIG[envOverride] ? envOverride : DEFAULT_ENV;

export const IS_LIVE = CURRENT_ENV === "live";

const defaultOrigin = URL_CONFIG[CURRENT_ENV].origin;
const defaultApiUrl = URL_CONFIG[CURRENT_ENV].apiUrl;

// Resolve Backend Origin & API Base URL
export const BACKEND_ORIGIN = normalizeUrl(
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.API_PROXY_TARGET,
  defaultOrigin
);

export const BACKEND_URL = BACKEND_ORIGIN;

export const API_BASE_URL = normalizeUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL,
  `${BACKEND_ORIGIN}/api/v1`
);

// 🔍 Console Log Indicator (Browser Console / Terminal me dikhega)
if (typeof window !== "undefined" || process.env.NODE_ENV !== "production") {
  console.log(
    `%c[TradeNexa Web] 🌐 Active ENV: %c${CURRENT_ENV.toUpperCase()}%c | API: %c${API_BASE_URL}`,
    "color: #888; font-weight: bold;",
    `color: ${IS_LIVE ? "#10b981" : "#f59e0b"}; font-weight: bold;`,
    "color: #888;",
    "color: #3b82f6; font-weight: bold;"
  );
}