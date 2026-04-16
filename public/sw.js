const CACHE_NAME = "stmarks-flora-v1";
const STATIC_CACHE = "stmarks-flora-static-v1";
const DATA_CACHE = "stmarks-flora-data-v1";

const PRE_CACHE_URLS = [
  "/",
  "/plants",
  "/calendar",
  "/habitats",
  "/field-guide",
  "/manifest.json",
];

// Install: pre-cache main routes
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRE_CACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(
            (key) =>
              key !== STATIC_CACHE && key !== DATA_CACHE && key !== CACHE_NAME
          )
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (request.method !== "GET" || url.origin !== location.origin) {
    return;
  }

  // Data requests (plant data, JSON, API-like paths): cache-first
  if (
    url.pathname.includes("/_next/data/") ||
    url.pathname.endsWith(".json") ||
    url.pathname.includes("/api/")
  ) {
    event.respondWith(cacheFirst(request, DATA_CACHE));
    return;
  }

  // Static assets (_next/static, images, icons): cache-first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff2?|ttf|css|js)$/)
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Pages (HTML navigation): network-first
  event.respondWith(networkFirst(request, STATIC_CACHE));
});

// Cache-first: try cache, fall back to network and update cache
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Return a basic offline fallback for failed requests
    return new Response("Offline", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

// Network-first: try network, fall back to cache
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    // Offline fallback page
    return new Response(
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline - St. Mark's Flora</title>
  <style>
    body { font-family: Georgia, serif; background: #FEFCF3; color: #3C2415; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1rem; text-align: center; }
    .container { max-width: 400px; }
    h1 { color: #2D5016; font-size: 1.5rem; }
    p { color: #7a6040; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div style="font-size: 4rem; margin-bottom: 1rem;">🌿</div>
    <h1>You're Offline</h1>
    <p>The page you requested isn't available offline yet. Try visiting it while connected to cache it for later use.</p>
    <p style="margin-top: 1.5rem;"><a href="/" style="color: #2D5016; font-weight: bold;">Go to Home Page</a></p>
  </div>
</body>
</html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }
    );
  }
}
