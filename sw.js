const CACHE_NAME = 'inbetween-v6.0-SILENT'; // Version bump forces new download
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 1. INSTALL: Caches the new silent files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Forces this new SW to activate immediately
});

// 2. ACTIVATE: Deletes the old version (v5.x, v4.x, etc)
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
