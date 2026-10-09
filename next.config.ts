import type { NextConfig } from "next";

const env = process.env.NEXT_PUBLIC_ENV?.toLowerCase()?.trim();
const BACKEND_TARGET =
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN ||
  (env === "dev"
    ? process.env.NEXT_PUBLIC_DEV_BACKEND_URL
    : env === "local"
      ? process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL
      : process.env.NEXT_PUBLIC_LIVE_BACKEND_URL) ||
  "";

const activeMode = (process.env.NEXT_PUBLIC_ENV || "local").toUpperCase();
const activeApi =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (BACKEND_TARGET ? `${BACKEND_TARGET.replace(/\/$/, "")}/api/v1` : "Not configured");

// 📢 Terminal startup banner showing active mode & URLs
const modeColor =
  activeMode === "LIVE"
    ? "\x1b[32m" // Green
    : activeMode === "DEV"
      ? "\x1b[35m" // Magenta
      : "\x1b[33m"; // Yellow (Local)
const bold = "\x1b[1m";
const cyan = "\x1b[36m";
const gray = "\x1b[90m";
const reset = "\x1b[0m";

console.log(`
${modeColor}============================================================${reset}
${bold}🚀 [TradeNexa Web] RUNNING IN ${modeColor}${activeMode} MODE${reset}
${cyan}   🌐 Environment : ${reset}${bold}${modeColor}${activeMode}${reset}
${cyan}   💻 Frontend    : ${reset}http://localhost:3000
${cyan}   🔗 Backend URL : ${reset}${BACKEND_TARGET || "None"}
${cyan}   📡 API Base    : ${reset}${activeApi}
${gray}   💡 Switch mode : Change NEXT_PUBLIC_ENV in .env (local | dev | live)${reset}
${modeColor}============================================================${reset}
`);

function getHostname(urlStr?: string): string | null {
  if (!urlStr) return null;
  try {
    return new URL(urlStr).hostname;
  } catch {
    return null;
  }
}

const customHostnames = [
  getHostname(process.env.NEXT_PUBLIC_BACKEND_ORIGIN),
  getHostname(process.env.NEXT_PUBLIC_LIVE_BACKEND_URL),
  getHostname(process.env.NEXT_PUBLIC_DEV_BACKEND_URL),
].filter((h): h is string => Boolean(h && h !== "localhost" && h !== "127.0.0.1"));

const nextConfig: NextConfig = {
  // Allow LAN access (mobile, other PCs) for dev server HMR without websocket blocking
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.*.*",
    "10.*.*.*",
  ],

  // Proxy /api/v1/* → Active backend target
  async rewrites() {
    if (!BACKEND_TARGET) return [];
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_TARGET}/api/v1/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "t3.storageapi.dev" },
      { protocol: "https", hostname: "**.railway.app" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "http", hostname: "192.168.*.*" },
      { protocol: "http", hostname: "10.*.*.*" },
      ...customHostnames.map((hostname) => ({
        protocol: (process.env.NEXT_PUBLIC_BACKEND_ORIGIN?.startsWith("http:") ? "http" : "https") as "http" | "https",
        hostname,
      })),
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;

