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

/**
 * Handle fetch response status.
 *
 * @param   object
 * @return  promise
 */
function responseStatus(fetchResponse) {
  if (fetchResponse.status !== 200) {
    return Promise.reject(new Error(fetchResponse.statusText))
  } else {
    return Promise.resolve(fetchResponse)
  }
}

/**
 * Handle fetch response
 * parsing to plain text.
 *
 * @param   object
 * @return  promise
 */
function responseText(fetchResponse) {
  return fetchResponse.text()
}

/**
 * Handle fetch response
 * parsing to json.
 *
 * @param   object
 * @return  promise
 */
function responseJSON(fetchResponse) {
  return fetchResponse.json()
}

/**
 * Console log error message.
 *
 * @param   mixed
 * @return  void
 */
function logError(error) {
  console.log(`Error: ${error}`)
}
