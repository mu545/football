// Register global variable
var soccer = {
  // current page
  main_page: '',
  current_page: '',
  // current container
  container: null,
  // available pages
  pages: {}
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

/**
 * Load requested page or reload current page.
 *
 * @param   string
 * @return  promise
 */
function loadPage(pathPage) {
  if (typeof pathPage === 'undefined') {
    pathPage = soccer.current_page
  }

  return fetch(`/pages/${pathPage}.html`)
    .then(responseStatus)
    .then(responseText)
    .then(function (pageContent) {
      soccer.current_page = pathPage

      return Promise.resolve(pageContent)
    })
}

/**
 * Handle load page error
 * fill container with page error message.
 *
 * @param   object
 * @return  void
 */
function pageError(err) {
  if (err.message === 'Not Found') {
    soccer.container.innerHTML =  `
                                  <p class="center-align"><img src="/images/sick.png"></p>
                                  <p class="center-align">Halaman tidak ditemukan</p>
                                  `
  } else {
    soccer.container.innerHTML =  `
                                  <p class="center-align"><img src="/images/sick.png"></p>
                                  <p class="center-align">Ups... halaman tidak dapat diakses</p>
                                  `
  }
}
