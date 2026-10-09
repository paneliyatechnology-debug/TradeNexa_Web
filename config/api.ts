/**
 * ==============================================================================
 * TradeNexa Web - API & Server URL Configuration
 * ==============================================================================
 * 
 * Supports three environments:
 * 1. local: Local backend (http://localhost:5000)
 * 2. dev:   Railway development backend (https://tradenexabackend-dev.up.railway.app)
 * 3. live:  Railway production backend (https://tradenexabackend-production.up.railway.app)
 * 
 * 👉 Switch via NEXT_PUBLIC_ENV in .env or change ACTIVE_ENV below:
 *    ACTIVE_ENV = 'local' | 'dev' | 'live'
 */

// Available environments
export const URL_CONFIG = {
  local: {
    origin: "http://localhost:5000",
    apiUrl: "http://localhost:5000/api/v1",
  },
  dev: {
    origin: "https://tradenexabackend-dev.up.railway.app",
    apiUrl: "https://tradenexabackend-dev.up.railway.app/api/v1",
  },
  live: {
    origin: "https://tradenexabackend-production.up.railway.app",
    apiUrl: "https://tradenexabackend-production.up.railway.app/api/v1",
  },
} as const;

export type AppEnvironment = keyof typeof URL_CONFIG;

// ==============================================================================
// ⚙️ MANUAL TOGGLE:
// Set to 'local', 'dev', or 'live'
// ==============================================================================
export const ACTIVE_ENV: AppEnvironment = "live"; // 👈 'local' | 'dev' | 'live'

// Check environment variables first (if NEXT_PUBLIC_ENV is provided)
const envVar = process.env.NEXT_PUBLIC_ENV?.toLowerCase()?.trim();
export const CURRENT_ENV: AppEnvironment =
  envVar === "local"
    ? "local"
    : envVar === "dev" || envVar === "development" || envVar === "staging"
      ? "dev"
      : envVar === "live" || envVar === "production" || envVar === "prod"
        ? "live"
        : ACTIVE_ENV;

export const IS_LOCAL = CURRENT_ENV === "local";
export const IS_DEV = CURRENT_ENV === "dev";
export const IS_LIVE = CURRENT_ENV === "live";

/**
 * Dynamically resolves Backend Origin.
 * Priority:
 * 1. Explicit NEXT_PUBLIC_BACKEND_ORIGIN env override
 * 2. Active environment config (live / dev / local)
 * 3. Deployed hostname safeguard (ensures HTTPS live backend on production domains)
 * 4. Local network IP or localhost for local testing
 */
export function getBackendOrigin(): string {
  // Explicit backend origin from env takes highest priority
  if (process.env.NEXT_PUBLIC_BACKEND_ORIGIN) {
    return process.env.NEXT_PUBLIC_BACKEND_ORIGIN.trim().replace(/\/$/, "");
  }

  // Active environment origin
  if (CURRENT_ENV === "live") {
    return URL_CONFIG.live.origin;
  }
  if (CURRENT_ENV === "dev") {
    return URL_CONFIG.dev.origin;
  }

  // Client-side detection when CURRENT_ENV is "local"
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
  // Env variable takes priority (e.g. NEXT_PUBLIC_API_BASE_URL)
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.trim().replace(/\/$/, "");
  }
  return `${getBackendOrigin()}/api/v1`;
}

// Resolve Backend Origin & API Base URL strictly from current environment
export const BACKEND_ORIGIN: string = getBackendOrigin();
export const BACKEND_URL: string = BACKEND_ORIGIN;
export const API_BASE_URL: string = getApiBaseUrl();

// 🔍 Console Log Indicator (Browser Console / Terminal me dikhega)
if (typeof window !== "undefined" || process.env.NODE_ENV !== "production") {
  const envBadgeColor = IS_LIVE ? "#10b981" : IS_DEV ? "#8b5cf6" : "#f59e0b";
  console.log(
    `%c[TradeNexa Web] 🌐 Active ENV: %c${CURRENT_ENV.toUpperCase()}%c | API: %c${getApiBaseUrl()}`,
    "color: #888; font-weight: bold;",
    `color: ${envBadgeColor}; font-weight: bold;`,
    "color: #888;",
    "color: #3b82f6; font-weight: bold;"
  );
}