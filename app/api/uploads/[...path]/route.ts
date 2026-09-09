import { NextRequest, NextResponse } from "next/server";
import { BACKEND_ORIGIN } from "@/config/api";

/**
 * Proxies backend /uploads/* files through the Next.js origin.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    const targetPath = path ? (Array.isArray(path) ? path.join("/") : String(path)) : "";
    const url = `${BACKEND_ORIGIN}/uploads/${targetPath}${request.nextUrl.search}`;

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      // Fallback: also try fetching from /media/ if backend stored under S3 key
      const fallbackUrl = `${BACKEND_ORIGIN}/media/${targetPath}${request.nextUrl.search}`;
      const fallbackRes = await fetch(fallbackUrl, { cache: "no-store" });
      if (fallbackRes.ok) {
        const contentType = fallbackRes.headers.get("content-type") || "application/octet-stream";
        const body = await fallbackRes.arrayBuffer();
        return new NextResponse(body, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
          },
        });
      }

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
    console.error("[WebUploadsProxy] Error fetching uploads:", err);
    return NextResponse.json(
      { success: false, message: "Unable to load uploads from backend." },
      { status: 502 }
    );
  }
}
