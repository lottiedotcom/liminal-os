const CACHE_NAME = 'inbetween-v5.0-SILENT';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 1. INSTALL: Cache the new files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Forces this new SW to become active immediately
});

// 2. ACTIVATE: Delete all old versions (v3.0, v4.0, etc)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// 3. FETCH: Serve from cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
