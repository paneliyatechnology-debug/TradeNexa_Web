/**
 * ==============================================================================
 * TradeNexa Web - API & Server URL Configuration
 * ==============================================================================
 * 
 * Aap yahan se easily Local (Testing) aur Live (Production) URL switch kar sakte hain:
 * 
 * 👉 Bas neeche `ACTIVE_ENV` ko 'local' ya 'live' set karein.
 */

// Available environments
export const URL_CONFIG = {
  local: {
    origin: "http://localhost:5000",
    apiUrl: "http://localhost:5000/api/v1",
  },
  live: {
    origin: "https://tradenexabackend-dev.up.railway.app",
    apiUrl: "https://tradenexabackend-dev.up.railway.app/api/v1",
  },
} as const;

export type AppEnvironment = keyof typeof URL_CONFIG;

// ==============================================================================
// ⚙️ MANUAL TOGGLE (Yahan change karke toggle karein):
// Set to 'local' for localhost:5000, or 'live' for Railway Production
// ==============================================================================
export const ACTIVE_ENV: AppEnvironment = "live"; // 👈 Change to 'local' or 'live'

// Check environment variables first (if NEXT_PUBLIC_ENV is provided)
const envVar = process.env.NEXT_PUBLIC_ENV?.toLowerCase()?.trim();
export const CURRENT_ENV: AppEnvironment =
  envVar === "local" || envVar === "live" ? envVar : ACTIVE_ENV;

export const IS_LIVE = CURRENT_ENV === "live";

/**
 * Dynamically resolves Backend Origin.
 * On mobile/LAN devices accessing via Wi-Fi (e.g. http://192.168.1.103:3000),
 * this automatically points to http://192.168.1.103:5000 instead of dead localhost:5000 on the phone.
 */
export function getBackendOrigin(): string {
  if (CURRENT_ENV === "live") {
    return URL_CONFIG.live.origin;
  }
  if (typeof window !== "undefined" && window.location?.hostname) {
    const host = window.location.hostname;
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return `http://${host}:5000`;
    }
  }
  return URL_CONFIG.local.origin;
}

export function getApiBaseUrl(): string {
  return `${getBackendOrigin()}/api/v1`;
}

// Resolve Backend Origin & API Base URL strictly from current environment
export const BACKEND_ORIGIN: string = getBackendOrigin();
export const BACKEND_URL: string = BACKEND_ORIGIN;
export const API_BASE_URL: string = getApiBaseUrl();

// 🔍 Console Log Indicator (Browser Console / Terminal me dikhega)
if (typeof window !== "undefined" || process.env.NODE_ENV !== "production") {
  console.log(
    `%c[TradeNexa Web] 🌐 Active ENV: %c${CURRENT_ENV.toUpperCase()}%c | API: %c${getApiBaseUrl()}`,
    "color: #888; font-weight: bold;",
    `color: ${IS_LIVE ? "#10b981" : "#f59e0b"}; font-weight: bold;`,
    "color: #888;",
    "color: #3b82f6; font-weight: bold;"
  );
}