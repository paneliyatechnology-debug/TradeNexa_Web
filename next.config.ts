import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN access (mobile, other PCs) for dev server HMR without websocket blocking
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.1.103:3000",
    "192.168.1.103",
    "192.168.*.*",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "t3.storageapi.dev" },
      { protocol: "https", hostname: "tradenexabackend-dev.up.railway.app" },
      { protocol: "https", hostname: "tradenexabackend-production.up.railway.app" },
      { protocol: "https", hostname: "**.railway.app" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "http", hostname: "192.168.*.*" },
      { protocol: "http", hostname: "10.*.*.*" },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
