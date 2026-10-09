import { NextRequest, NextResponse } from "next/server";
import { BACKEND_ORIGIN, URL_CONFIG, CURRENT_ENV } from "@/config/api";

async function proxyRequest(request: NextRequest, path: string[]) {
  const targetPath = path.join("/");
  const search = request.nextUrl.search;
  const reqHost = request.headers.get("host") || "";

  // Guard against self-looping when Web & Backend share the same host/port in local mode
  const isSelfCall =
    Boolean(reqHost && BACKEND_ORIGIN.includes(reqHost) && !BACKEND_ORIGIN.startsWith("https://"));

  const candidateOrigins = Array.from(
    new Set(
      [
        !isSelfCall ? BACKEND_ORIGIN : null,
        URL_CONFIG[CURRENT_ENV]?.origin,
        URL_CONFIG.live.origin,
        URL_CONFIG.dev.origin,
        URL_CONFIG.local.origin,
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

      if (process.env.NODE_ENV !== "production") {
        const modeColor = CURRENT_ENV === "live" ? "\x1b[32m" : CURRENT_ENV === "dev" ? "\x1b[35m" : "\x1b[33m";
        const methodColor = request.method === "GET" ? "\x1b[32m" : request.method === "POST" ? "\x1b[34m" : "\x1b[35m";
        const statusColor = response.status < 400 ? "\x1b[32m" : "\x1b[31m";
        console.log(
          `\x1b[1m[API Proxy]\x1b[0m ${modeColor}[${CURRENT_ENV.toUpperCase()}]\x1b[0m ${methodColor}${request.method}\x1b[0m /api/v1/${targetPath} ➔ \x1b[36m${origin}\x1b[0m (${statusColor}${response.status}\x1b[0m)`
        );
      }

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

  if (process.env.NODE_ENV !== "production") {
    console.error(
      `\x1b[31m\x1b[1m[API Proxy 502]\x1b[0m [${CURRENT_ENV.toUpperCase()}] Failed to reach backend for /api/v1/${targetPath}. Target: ${candidateOrigins.join(", ")}`
    );
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
