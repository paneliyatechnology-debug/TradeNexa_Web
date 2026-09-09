import { NextRequest, NextResponse } from "next/server";
import { BACKEND_ORIGIN } from "@/config/api";

/**
 * Proxies backend /media/* files through the Next.js origin.
 * Required because Railway serves media with `Cross-Origin-Resource-Policy: same-origin`,
 * which blocks <img> tags on localhost / Vercel from loading images directly.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    const targetPath = path ? (Array.isArray(path) ? path.join("/") : String(path)) : "";
    const url = `${BACKEND_ORIGIN}/media/${targetPath}${request.nextUrl.search}`;
    console.log(`[WebMediaProxy] Fetching: ${url}`);

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      console.error(`[WebMediaProxy] Failed to fetch ${url} - status: ${response.status}`);
      return new NextResponse(null, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const body = await response.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    console.error("[WebMediaProxy] Error fetching media:", err);
    return NextResponse.json(
      { success: false, message: "Unable to load media from backend." },
      { status: 502 }
    );
  }
}
