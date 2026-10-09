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

// Available environments (read strictly from environment variables)
export const URL_CONFIG = {
  local: {
    origin: process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL || "",
    apiUrl: process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL
      ? `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL.replace(/\/$/, "")}/api/v1`
      : "",
  },
  dev: {
    origin: process.env.NEXT_PUBLIC_DEV_BACKEND_URL || "",
    apiUrl: process.env.NEXT_PUBLIC_DEV_BACKEND_URL
      ? `${process.env.NEXT_PUBLIC_DEV_BACKEND_URL.replace(/\/$/, "")}/api/v1`
      : "",
  },
  live: {
    origin: process.env.NEXT_PUBLIC_LIVE_BACKEND_URL || "",
    apiUrl: process.env.NEXT_PUBLIC_LIVE_BACKEND_URL
      ? `${process.env.NEXT_PUBLIC_LIVE_BACKEND_URL.replace(/\/$/, "")}/api/v1`
      : "",
  },
} as const;

export type AppEnvironment = keyof typeof URL_CONFIG;

// ==============================================================================
// ⚙️ MANUAL TOGGLE:
// Default environment if NEXT_PUBLIC_ENV is not specified
// ==============================================================================
export const ACTIVE_ENV: AppEnvironment = "live";

// Check environment variables first (NEXT_PUBLIC_ENV)
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
 * Dynamically resolves Backend Origin from environment variables.
 * Priority:
 * 1. Explicit NEXT_PUBLIC_BACKEND_ORIGIN env override
 * 2. Active environment origin (from NEXT_PUBLIC_*_BACKEND_URL in .env)
 * 3. Client-side LAN / localhost resolution
 */
export function getBackendOrigin(): string {
  // 1. Explicit backend origin from env takes highest priority
  if (process.env.NEXT_PUBLIC_BACKEND_ORIGIN) {
    return process.env.NEXT_PUBLIC_BACKEND_ORIGIN.trim().replace(/\/$/, "");
  }

  // 2. Origin for active environment
  const activeOrigin = URL_CONFIG[CURRENT_ENV]?.origin;
  if (activeOrigin) {
    return activeOrigin.trim().replace(/\/$/, "");
  }

  // 3. Fallback to live origin from env if available
  if (URL_CONFIG.live.origin) {
    return URL_CONFIG.live.origin.trim().replace(/\/$/, "");
  }

  // 4. Client-side LAN testing on mobile devices
  if (typeof window !== "undefined" && window.location?.hostname) {
    const host = window.location.hostname;
    const protocol = window.location.protocol;

    const isPrivateLanIp = /^(?:192\.168\.|10\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(host);
    if (isPrivateLanIp && protocol === "http:" && URL_CONFIG.local.origin) {
      try {
        const localPort = new URL(URL_CONFIG.local.origin).port;
        return localPort ? `http://${host}:${localPort}` : `http://${host}`;
      } catch {
        /* fallback to local origin */
      }
    }

    if (host === "localhost" || host === "127.0.0.1") {
      return URL_CONFIG.local.origin;
    }
  }

  return URL_CONFIG.local.origin || "";
}

export function getApiBaseUrl(): string {
  // 1. Explicit API base URL from env takes highest priority
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.trim().replace(/\/$/, "");
  }

  // 2. Active environment API URL
  const activeApiUrl = URL_CONFIG[CURRENT_ENV]?.apiUrl;
  if (activeApiUrl) {
    return activeApiUrl.trim().replace(/\/$/, "");
  }

  // 3. Origin-based API URL
  const origin = getBackendOrigin();
  return origin ? `${origin}/api/v1` : "";
}

// Resolve Backend Origin & API Base URL strictly from current environment
export const BACKEND_ORIGIN: string = getBackendOrigin();
export const BACKEND_URL: string = BACKEND_ORIGIN;
export const API_BASE_URL: string = getApiBaseUrl();

let hasPrintedServerBanner = false;

/**
 * Prints a clear, prominent banner in the server terminal showing active mode and running URLs.
 */
export function printServerBanner(force = false): void {
  if (typeof window !== "undefined") return;
  if (hasPrintedServerBanner && !force) return;
  hasPrintedServerBanner = true;

  const modeUpper = CURRENT_ENV.toUpperCase();
  const modeColor = IS_LIVE
    ? "\x1b[32m" // Green
    : IS_DEV
      ? "\x1b[35m" // Magenta
      : "\x1b[33m"; // Yellow (Local)
  const bold = "\x1b[1m";
  const cyan = "\x1b[36m";
  const gray = "\x1b[90m";
  const reset = "\x1b[0m";

  console.log(`
${modeColor}============================================================${reset}
${bold}🚀 [TradeNexa Web] RUNNING IN ${modeColor}${modeUpper} MODE${reset}
${cyan}   🌐 Environment : ${reset}${bold}${modeColor}${modeUpper}${reset}
${cyan}   💻 Frontend    : ${reset}http://localhost:3000
${cyan}   🔗 Backend URL : ${reset}${BACKEND_ORIGIN || "None"}
${cyan}   📡 API Base    : ${reset}${API_BASE_URL || "None"}
${gray}   💡 Switch mode : Change NEXT_PUBLIC_ENV in .env (local | dev | live)${reset}
${modeColor}============================================================${reset}
`);
}

// 🔍 Console Log Indicator (Shows active mode and URLs in browser console and server terminal)
if (typeof window !== "undefined") {
  // Browser console
  const envBadgeColor = IS_LIVE ? "#10b981" : IS_DEV ? "#8b5cf6" : "#f59e0b";
  console.log(
    `%c[TradeNexa Web] 🌐 Mode: %c${CURRENT_ENV.toUpperCase()}%c | Backend: %c${BACKEND_ORIGIN || "None"}%c | API: %c${API_BASE_URL}`,
    "color: #888; font-weight: bold;",
    `color: ${envBadgeColor}; font-weight: bold;`,
    "color: #888;",
    "color: #10b981; font-weight: bold;",
    "color: #888;",
    "color: #3b82f6; font-weight: bold;"
  );
} else if (process.env.NODE_ENV !== "production") {
  // Node.js server terminal startup
  printServerBanner();
}