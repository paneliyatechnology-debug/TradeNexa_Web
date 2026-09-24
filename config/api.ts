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
export const ACTIVE_ENV: AppEnvironment = "local"; // 👈 Change to 'local' or 'live'

// Check environment variables first (if NEXT_PUBLIC_ENV is provided)
const envVar = process.env.NEXT_PUBLIC_ENV?.toLowerCase()?.trim();
export const CURRENT_ENV: AppEnvironment =
  envVar === "local" || envVar === "live" ? envVar : ACTIVE_ENV;

export const IS_LIVE = CURRENT_ENV === "live";

/**
 * Dynamically resolves Backend Origin.
 * - On production/deployed sites (Vercel, HTTPS, .vercel.app, tradenexa domains),
 *   automatically uses the live Railway backend (https://tradenexabackend-dev.up.railway.app).
 * - On local LAN/mobile devices accessing via local Wi-Fi (e.g. http://192.168.1.103:3000),
 *   points to http://192.168.1.103:5000.
 * - On local development machine (localhost / 127.0.0.1),
 *   points to http://localhost:5000.
 */
export function getBackendOrigin(): string {
  if (CURRENT_ENV === "live") {
    return URL_CONFIG.live.origin;
  }

  if (typeof window !== "undefined" && window.location?.hostname) {
    const host = window.location.hostname;
    const protocol = window.location.protocol;

    // Any HTTPS or deployed production domain (like Vercel, Railway, custom domain)
    // MUST use the live HTTPS backend to prevent Mixed Content blocking.
    if (
      protocol === "https:" ||
      host.includes("vercel.app") ||
      host.includes("railway.app") ||
      host.includes("tradenexa") ||
      host.endsWith(".app") ||
      host.endsWith(".com")
    ) {
      return URL_CONFIG.live.origin;
    }

    // Local Wi-Fi / private LAN IP testing on mobile (e.g. 192.168.x.x, 10.x.x.x)
    const isPrivateLanIp = /^(?:192\.168\.|10\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(host);
    if (isPrivateLanIp && protocol === "http:") {
      return `http://${host}:5000`;
    }

    if (host === "localhost" || host === "127.0.0.1") {
      return URL_CONFIG.local.origin;
    }
  }

  // Server-side rendering fallback for production deployments
  if (process.env.NODE_ENV === "production" && (process.env.VERCEL || process.env.NEXT_PUBLIC_VERCEL_URL)) {
    return URL_CONFIG.live.origin;
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