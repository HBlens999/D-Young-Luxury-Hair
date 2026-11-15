const CACHE_NAME = 'd-young-app-v2';
const APP_SHELL = ['/', '/manifest.webmanifest'];

const offlineResponse = () => new Response(
  '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>D-Young Luxury Hair</title></head><body><main style="font-family:system-ui,sans-serif;max-width:34rem;margin:12vh auto;padding:1.5rem"><h1>You are offline</h1><p>D-Young Luxury Hair could not reach the website. Check your internet connection and reload this page.</p></main></body></html>',
  { status: 503, statusText: 'Service Unavailable', headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
);

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  // Network-first navigation keeps admin and storefront pages up to date.
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            event.waitUntil(
              caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {})
            );
          }
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;
          const appShell = await caches.match('/');
          return appShell || offlineResponse();
        })
    );
    return;
  }

  // Network-first for same-origin resources, with a valid Response on every path.
  if (new URL(request.url).origin === self.location.origin) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            event.waitUntil(
              caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {})
            );
          }
          return response;
        })
        .catch(async () => {
          return (await caches.match(request)) || offlineResponse();
        })
    );
  }
});
