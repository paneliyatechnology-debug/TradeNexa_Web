// TradeNexa PWA Service Worker (Focused on Image Caching & Offline support)
const CACHE_NAME = "tradenexa-pwa-v3";
const IMAGE_CACHE = "tradenexa-images-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== IMAGE_CACHE && key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

function isImageRequest(request, url) {
  return (
    request.destination === "image" ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|gif|avif)$/i) ||
    url.hostname.includes("storageapi.dev") ||
    url.hostname.includes("railway.app") ||
    url.pathname.startsWith("/uploads/")
  );
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // ONLY intercept images for instant cache-first delivery.
  // Never intercept scripts, Next.js chunks, or development files to keep Network clean.
  if (isImageRequest(event.request, url)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) {
          return cached;
        }
        try {
          const response = await fetch(event.request);
          if (response && response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        } catch {
          return new Response("", { status: 408, statusText: "Image unavailable offline" });
        }
      })
    );
  }
});
