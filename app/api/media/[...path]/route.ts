import { NextRequest, NextResponse } from "next/server";
import { BACKEND_ORIGIN, URL_CONFIG } from "@/config/api";

const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" rx="12" fill="#f1f5f9"/>
  <path d="M60 135L88 100L108 120L128 92L152 135H60Z" fill="#cbd5e1"/>
  <circle cx="80" cy="78" r="10" fill="#cbd5e1"/>
</svg>`;

/**
 * Proxies backend /media/* files through the Next.js origin.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    const rawPath = path ? (Array.isArray(path) ? path.join("/") : String(path)) : "";
    const cleanPath = rawPath.replace(/^(uploads|media)\//, "");
    const search = request.nextUrl.search;

    const candidateUrls = [
      `${BACKEND_ORIGIN}/media/${cleanPath}${search}`,
      `${BACKEND_ORIGIN}/uploads/${cleanPath}${search}`,
      `${BACKEND_ORIGIN}/api/media/${cleanPath}${search}`,
      `${BACKEND_ORIGIN}/api/uploads/${cleanPath}${search}`,
      `http://localhost:5000/media/${cleanPath}${search}`,
      `http://localhost:5000/uploads/${cleanPath}${search}`,
      `${URL_CONFIG.live.origin}/media/${cleanPath}${search}`,
      `${URL_CONFIG.live.origin}/uploads/${cleanPath}${search}`,
      `${URL_CONFIG.live.origin}/api/media/${cleanPath}${search}`,
      `${URL_CONFIG.live.origin}/api/uploads/${cleanPath}${search}`,
    ];

    for (const targetUrl of candidateUrls) {
      try {
        const response = await fetch(targetUrl, { cache: "no-store" });
        if (response.ok) {
          const contentType = response.headers.get("content-type") || "application/octet-stream";
          const body = await response.arrayBuffer();
          return new NextResponse(body, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
            },
          });
        }
      } catch {
        /* try next candidate */
      }
    }

    return new NextResponse(PLACEHOLDER_SVG, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (err) {
    console.error("[WebMediaProxy] Error fetching media:", err);
    return new NextResponse(PLACEHOLDER_SVG, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }
}
