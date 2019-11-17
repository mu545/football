// Service Worker Config
const CONFIG_CACHE_NAME = 'soccer-v0.0.1'
const CONFIG_CACHE_URLS = [
  '/',
  '/css/materialize.min.css',
  '/images/icon-72x72.png',
  '/images/icon-96x96.png',
  '/images/icon-128x128.png',
  '/images/icon-144x144.png',
  '/images/icon-192x192.png',
  '/images/icon-256x256.png',
  '/images/icon-386x386.png',
  '/images/icon-512x512.png',
  '/main.js',
  '/js/index.js',
  '/js/materialize.min.js',
  '/index.html',
  '/pages/home/index.html'
]

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CONFIG_CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(CONFIG_CACHE_URLS)
      })
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheName !== CONFIG_CACHE_NAME) {
              console.log(`Service worker: cache ${cacheName} deleted`)

              return caches.delete(cacheName)
            }
          })
        )
      })
  )
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        return response || fetch(event.request)
      })
  )
})
