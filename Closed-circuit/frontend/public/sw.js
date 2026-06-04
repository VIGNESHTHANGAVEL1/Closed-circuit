const APP_SHELL_CACHE = 'closed-circuit-shell-v2';
const RUNTIME_CACHE = 'closed-circuit-runtime-v2';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/pwa-192-v2.png',
  '/pwa-512-v2.png',
  '/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => ![APP_SHELL_CACHE, RUNTIME_CACHE].includes(cacheName))
          .map((cacheName) => caches.delete(cacheName)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  if (['style', 'script', 'worker', 'image', 'font'].includes(request.destination)) {
    event.respondWith(handleStaticAssetRequest(request));
  }
});

async function handleNavigationRequest(request) {
  const cache = await caches.open(APP_SHELL_CACHE);

  try {
    const networkResponse = await fetch(request);
    cache.put('/index.html', networkResponse.clone());
    return networkResponse;
  } catch {
    const cachedPage = await cache.match(request, { ignoreSearch: true });

    if (cachedPage) {
      return cachedPage;
    }

    const appShell = await cache.match('/index.html');

    if (appShell) {
      return appShell;
    }

    return cache.match('/offline.html');
  }
}

async function handleStaticAssetRequest(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request, { ignoreSearch: true });

  if (cachedResponse) {
    void refreshCachedAsset(cache, request);
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch {
    return cachedResponse || Response.error();
  }
}

async function refreshCachedAsset(cache, request) {
  try {
    const networkResponse = await fetch(request);
    cache.put(request, networkResponse.clone());
  } catch {
    // Keep the existing cached asset when refresh fails.
  }
}
