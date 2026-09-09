import { NextRequest, NextResponse } from "next/server";
import { BACKEND_ORIGIN, URL_CONFIG } from "@/config/api";

/**
 * Proxies backend /uploads/* files through the Next.js origin.
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
      `${BACKEND_ORIGIN}/uploads/${cleanPath}${search}`,
      `${BACKEND_ORIGIN}/media/${cleanPath}${search}`,
      `${URL_CONFIG.live.origin}/uploads/${cleanPath}${search}`,
      `${URL_CONFIG.live.origin}/media/${cleanPath}${search}`,
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

    return new NextResponse(null, { status: 404 });
  } catch (err) {
    console.error("[WebUploadsProxy] Error fetching uploads:", err);
    return NextResponse.json(
      { success: false, message: "Unable to load uploads from backend." },
      { status: 502 }
    );
  }
}
