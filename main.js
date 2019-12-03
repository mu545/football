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

/**
 * Row match
 *
 * @param   object
 * @param   number
 * @return  string
 */
function rowMatch(match, key) {
  let matchDate = new Date(match.utcDate)
  let matchMonth = matchDate.getMonth()
  matchMonth = matchMonth < 10 ? '0' + matchMonth : matchMonth
  let matchDay = matchDate.getDate()
  matchDay = matchDay < 10 ? '0' + matchDay : matchDay
  let matchYear = matchDate.getFullYear()
  matchYear = matchYear % 100
  let matchHour = matchDate.getHours()
  let matchMinute = matchDate.getMinutes()
  let matchClock = 'AM'
  let awayScore = 0
  let homeScore = 0

  if (matchHour > 12 || (matchHour === 12 && matchMinute > 0)) {
    matchHour = matchHour % 12
    matchClock = 'PM'
  }

  if (matchHour < 10) {
    matchHour = '0' + matchHour
  }

  if (matchMinute < 10) {
    matchMinute = '0' + matchMinute
  }

  if (match.score.extraTime.awayTeam && match.score.extraTime.homeTeam) {
    awayScore += match.score.extraTime.awayTeam
    homeScore += match.score.extraTime.homeTeam
  }

  if (match.score.fullTime.awayTeam && match.score.fullTime.homeTeam) {
    awayScore += match.score.fullTime.awayTeam
    homeScore += match.score.fullTime.homeTeam
  }

  if (match.score.halfTime.awayTeam && match.score.halfTime.homeTeam) {
    awayScore += match.score.halfTime.awayTeam
    homeScore += match.score.halfTime.homeTeam
  }

  if (match.score.penalties.awayTeam && match.score.penalties.homeTeam) {
    awayScore += match.score.penalties.awayTeam
    homeScore += match.score.penalties.homeTeam
  }

  return `
          <tr>
            <td>
              <a
                class="purple-text text-darken-4"
                href="#team-detail"
                data-team-id="${match.awayTeam.id}">${match.awayTeam.name}</a>
            </td>
            <td>
              <a
                class="purple-text text-darken-4"
                href="#match-save"
                data-match-key="${key}">
                <p>${awayScore} : ${homeScore}</p>
                <p>${matchMonth}/${matchDay}/${matchYear}</p>
                <p>${matchHour}:${matchMinute} ${matchClock}</p>
              </a>
            </td>
            <td>
              <a
                class="purple-text text-darken-4"
                href="#team-detail"
                data-team-id="${match.homeTeam.id}">${match.homeTeam.name}</a>
            </td>
          </tr>
        `
}
