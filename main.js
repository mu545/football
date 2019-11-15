// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function () {
        console.log('Service worker: registered')
      })
      .catch(function () {
        console.log('Service worker: could not be registered')
      })
  })
} else {
  console.log('Service worker: browser not support')
}
