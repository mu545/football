// Register global variable
var soccer = {
  // database
  db_name: 'soccer-info',
  db_version: 1,
  db: null,
  // current page
  main_page: '',
  current_page: '',
  // current container
  container: null,
  // available pages
  pages: {},
  // football-data api handler
  api_url: 'http://localhost:3000/users/api/v1'
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

    logError(err)
  }
}

/**
 * Add data to database.
 *
 * @param   string
 * @param   mixed
 * @param   mixed
 * @return  promise
 */
function dbAdd(storeName, data, key) {
  return soccer.db.then(function (db) {
    return db.transaction(storeName, 'readwrite')
      .objectStore(storeName)
      .add(data, key)
  })
}

/**
 * Get data from database.
 *
 * @param   string
 * @param   mixed
 * @return  promise
 */
function dbGet(storeName, key) {
  return soccer.db.then(function (db) {
    return db.transaction(storeName, 'readwrite')
      .objectStore(storeName)
      .get(key)
  })
}

/**
 * Update data in database.
 *
 * @param   string
 * @param   mixed
 * @param   mixed
 * @return  promise
 */
function dbPut(storeName, data, key) {
  return soccer.db.then(function (db) {
    return db.transaction(storeName, 'readwrite')
      .objectStore(storeName)
      .put(data, key)
  })
}

/**
 * Delete data from database.
 *
 * @param   string
 * @param   mixed
 * @return  promise
 */
function dbDelete(storeName, key) {
  return soccer.db.then(function (db) {
    return db.transaction(storeName, 'readwrite')
      .objectStore(storeName)
      .delete(key)
  })
}

/**
 * Open store cursor database.
 *
 * @param   string
 * @return  promise
 */
function dbCursor(storeName) {
  return soccer.db.then(function (db) {
    return db.transaction(storeName)
      .store
      .openCursor()
  })
}
