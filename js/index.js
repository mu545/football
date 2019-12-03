document.addEventListener('DOMContentLoaded', function () {
  // Initialization global variable
  soccer.main_page = window.location.pathname
    .substr(1, Math.ceil(window.location.pathname.indexOf('.') - 1))
    .toLowerCase()

  if (soccer.main_page === '' || soccer.main_page === 'index') {
    soccer.main_page = 'home'
  }

  soccer.current_page = window.location.hash.substr(1).toLowerCase()

  if (soccer.current_page === '') {
    soccer.current_page = `${soccer.main_page}/index`
  } else {
    soccer.current_page = `${soccer.main_page}/${soccer.current_page}`
  }

  soccer.query = new URLSearchParams(window.location.search)

  soccer.container = document.getElementById('Container')

  // Load available navigation
  // copy navigation on top to side.
  let sideNav = M.Sidenav.init(document.getElementById('SideNav'))

  document.querySelectorAll('.topnav')
    .forEach(function (nav) {
      sideNav.el.innerHTML = nav.innerHTML
    })
})

window.addEventListener('load', function () {
  // Initialization page.
  serviceWorker('Init')
    .then(openDB)
    .then(loadCurrentPage)
    .then(console.log)
    .catch(pageError)

  /**
   * Register service worker.
   *
   * @param   string
   * @return  promise
   */
  function serviceWorker(msgChain) {
    if ('serviceWorker' in navigator) {
      return navigator.serviceWorker.register('/service-worker.js')
        .then(function () {
          msgChain += '\nserviceWorker: registered'

          return Promise.resolve(msgChain)
        })
        .catch(function () {
          msgChain += '\nserviceWorker: could not be registered'

          return Promise.resolve(msgChain)
        })
    } else {
      msgChain += '\nserviceWorker: browser not support'

      return Promise.resolve(msgChain)
    }
  }

  /**
   * Open database connection.
   *
   * @param   string
   * @return  promise
   */
  function openDB(msgChain) {
    soccer.db = idb.openDB(soccer.db_name, soccer.db_version, {
      upgrade: function (db) {
        if (!db.objectStoreNames.contains('matches')) {
          let matches = db.createObjectStore('matches')

          matches.createIndex('id', 'id', {
            unique: true
          })
        }
      }
    })

    msgChain += '\nopenDB: database connected'

    return Promise.resolve(msgChain)
  }

  /**
   * Load current page
   * fill content to container and run page init.
   *
   * @param   string
   * @return  promise
   */
  function loadCurrentPage(msgChain) {
    return loadPage()
      .then(function (pageContent) {
        soccer.container.innerHTML = pageContent
        soccer.pages[soccer.current_page]()

        msgChain += `\nloadCurrentPage: ${soccer.current_page}`

        return Promise.resolve(msgChain)
      })
  }
})
