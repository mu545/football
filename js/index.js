document.addEventListener('DOMContentLoaded', function () {
  // Initialization global variable
  let currentPath = window.location.hash.split('?')
  soccer.current_page = `${currentPath[0].substr(1).toLowerCase()}`

  if (soccer.current_page === '') {
    soccer.current_page = 'home'
  }

  soccer.query = new URLSearchParams(currentPath[1] || '')

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

        if (!db.objectStoreNames.contains('teams')) {
          let teams = db.createObjectStore('teams')

          teams.createIndex('id', 'id', {
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
    // change page on hash change
    window.addEventListener('hashchange', function () {
      let newPath = window.location.hash.split('?')
      soccer.current_page = `${newPath[0].substr(1).toLowerCase()}`

      if (soccer.current_page === '') {
        soccer.current_page = 'home'
      }

      soccer.query = new URLSearchParams(newPath[1] || '')

      loadPage()
        .then(function (pageContent) {
          soccer.container.innerHTML = pageContent
          soccer.pages[soccer.current_page]()

          console.log(`loadCurrentPage: ${soccer.current_page}`)
        })
        .catch(pageError)
    })

    return loadPage()
      .then(function (pageContent) {
        soccer.container.innerHTML = pageContent
        soccer.pages[soccer.current_page]()

        msgChain += `\nloadCurrentPage: ${soccer.current_page}`

        return Promise.resolve(msgChain)
      })
  }
})
