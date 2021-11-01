var cacheName = 'enjad-pwa';

var filesToCache = [
  '/enjad/',
  '/enjad/index.html',
  '/enjad/js/extlib/jquery/jquery-3.6.0.min.js',
  '/enjad/js/extlib/popper.js/1.14.7/umd/popper.min.js',
  '/enjad/js/extlib/bootstrap/4.3.1/css/bootstrap.min.css',
  '/enjad/js/extlib/bootstrap/4.3.1/js/bootstrap.min.js',
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