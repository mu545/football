importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.precaching.precacheAndRoute([
  {
    url: '/',
    revision: 1
  },
  {
    url: '/manifest.json',
    revision: 1
  },
  {
    url: '/css/materialize.min.css',
    revision: 1
  },
  {
    url: 'https://fonts.googleapis.com/icon?family=Material+Icons',
    revision: 1
  },
  {
    url: '/images/icon-72x72.png',
    revision: 1
  },
  {
    url: '/images/icon-96x96.png',
    revision: 1
  },
  {
    url: '/images/icon-128x128.png',
    revision: 1
  },
  {
    url: '/images/icon-144x144.png',
    revision: 1
  },
  {
    url: '/images/icon-192x192.png',
    revision: 1
  },
  {
    url: '/images/icon-256x256.png',
    revision: 1
  },
  {
    url: '/images/icon-384x384.png',
    revision: 1
  },
  {
    url: '/images/icon-512x512.png',
    revision: 1
  },
  {
    url: '/images/sick.png',
    revision: 1
  },
  {
    url: '/images/sport-cup.png',
    revision: 1
  },
  {
    url: '/images/sport-podium.png',
    revision: 1
  },
  {
    url: '/images/sport-watch.png',
    revision: 1
  },
  {
    url: '/images/sport-done.png',
    revision: 1
  },
  {
    url: '/images/sport-ribbon.png',
    revision: 1
  },
  {
    url: '/main.js',
    revision: 1
  },
  {
    url: '/js/idb.min.js',
    revision: 1
  },
  {
    url: '/js/materialize.min.js',
    revision: 1
  },
  {
    url: '/js/index.js',
    revision: 1
  },
  {
    url: '/js/football-data.js',
    revision: 1
  },
  {
    url: '/js/pages/first-access.js',
    revision: 1
  },
  {
    url: '/js/pages/home.js',
    revision: 1
  },
  {
    url: '/js/pages/league.js',
    revision: 1
  },
  {
    url: '/js/pages/schedule.js',
    revision: 1
  },
  {
    url: '/js/pages/team.js',
    revision: 1
  },
  {
    url: '/js/pages/favorite.js',
    revision: 1
  },
  {
    url: '/index.html',
    revision: 1
  },
  {
    url: '/pages/first-access.html',
    revision: 1
  },
  {
    url: '/pages/home.html',
    revision: 1
  },
  {
    url: '/pages/league.html',
    revision: 1
  },
  {
    url: '/pages/league/detail.html',
    revision: 1
  },
  {
    url: '/pages/schedule.html',
    revision: 1
  },
  {
    url: '/pages/team.html',
    revision: 1
  },
  {
    url: '/pages/favorite.html',
    revision: 1
  }
])

workbox.routing.registerRoute(
  new RegExp('/css/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'css',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60
      })
    ]
  })
)

workbox.routing.registerRoute(
  new RegExp('/images/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60
      })
    ]
  })
)

workbox.routing.registerRoute(
  /\.(?:js)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'js',
    timeout: 30
  })
)

workbox.routing.registerRoute(
  new RegExp('/pages/'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'pages',
    timeout: 30
  })
)

workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30
      })
    ]
  })
)

workbox.routing.registerRoute(
  /^http:\/\/localhost:3000\/users\/api\/v1/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'football-data',
    timeout: 30
  })
)
