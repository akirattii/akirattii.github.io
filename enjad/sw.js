var cacheName = 'enjad-pwa';

var filesToCache = [
  '/enjad/',
  '/enjad/index.html',
  '/enjad/favicon.ico',

  // CDNs:
  "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css",
  "https://code.jquery.com/jquery-3.6.0.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js",
  "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js",

  // For apps:
  '/enjad/css/style.css',
  '/enjad/js/main.js',
  '/enjad/js/ejdic.js',
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});