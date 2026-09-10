import { NextRequest, NextResponse } from "next/server";
import { BACKEND_ORIGIN, URL_CONFIG, CURRENT_ENV } from "@/config/api";

const otherOrigin = CURRENT_ENV === "local" ? URL_CONFIG.live.origin : URL_CONFIG.local.origin;

async function proxyRequest(request: NextRequest, path: string[]) {
  const targetPath = path.join("/");
  const search = request.nextUrl.search;
  const reqHost = request.headers.get("host") || "";

  // Guard against self-looping when Web & Backend share the same host/port in local mode
  const isSelfCall =
    BACKEND_ORIGIN.includes(reqHost) && !BACKEND_ORIGIN.includes("railway.app");

  const candidateOrigins = Array.from(
    new Set(
      [
        !isSelfCall ? BACKEND_ORIGIN : null,
        otherOrigin,
        "http://localhost:5000",
        "http://127.0.0.1:3000",
        URL_CONFIG.live.origin,
      ].filter(Boolean) as string[]
    )
  );

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("Authorization", authorization);

  let bodyBuffer: ArrayBuffer | null = null;
  if (request.method !== "GET" && request.method !== "HEAD") {
    bodyBuffer = await request.arrayBuffer();
  }

  for (const origin of candidateOrigins) {
    const url = `${origin}/api/v1/${targetPath}${search}`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500); // 3.5s max timeout (never hang 30s)

      const response = await fetch(url, {
        method: request.method,
        headers,
        body: bodyBuffer,
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const body = await response.text();
      return new NextResponse(body, {
        status: response.status,
        headers: {
          "Content-Type": response.headers.get("content-type") || "application/json",
        },
      });
    } catch {
      /* Try next candidate */
    }
  }

  return NextResponse.json(
    { success: false, message: "Unable to reach backend server." },
    { status: 502 }
  );
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}
