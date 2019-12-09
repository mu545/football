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
    .then(requestNotification)
    .then(pushManager)
    .then(isFirstAccess)
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
        if (!db.objectStoreNames.contains('settings')) {
          let settings = db.createObjectStore('settings')

          settings.createIndex('id', 'id', {
            unique: true
          })
        }

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
   * Request notification.
   *
   * @param   string
   * @return  promise
   */
  function requestNotification(msgChain) {
    if ('Notification' in window) {
      return Notification.requestPermission()
        .then(function (result) {
          if (result === 'denied') {
            msgChain += '\nrequestNotification: not allowed'
          } else if (result === 'default') {
            msgChain += '\nrequestNotification: user closed box dialog'
          } else {
            msgChain += '\nrequestNotification: allowed'
          }

          return Promise.resolve(msgChain)
        })
    } else {
      msgChain += '\nrequestNotification: browser not support'

      return Promise.resolve(msgChain)
    }
  }

  /**
   * Push manager.
   *
   * @param   string
   * @return  promise
   */
  function pushManager(msgChain) {
    if ('PushManager' in window) {
      return navigator.serviceWorker.getRegistration()
        .then(function (registration) {
          return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('BHf1iutHq1lUAfcjIBcHKSVIQOXgs2ft8TBO7VrnckFm1DU1utBPRzN6N9p200j4riwkcPfGlDY8qjlxNjXdICw')
          })
          .then(function (subscribe) {
            let p256dh = new Uint8Array(subscribe.getKey('p256dh'))
            p256dh = btoa(String.fromCharCode.apply(null, p256dh))
            let auth = new Uint8Array(subscribe.getKey('auth'))
            auth = btoa(String.fromCharCode.apply(null, auth))

            msgChain += `\npushManager: subscribe endpoint ${subscribe.endpoint}`
            msgChain += `\npushManager: p256dh key ${p256dh}`
            msgChain += `\npushManager: auth ${auth}`

            return Promise.resolve(msgChain)
          }).catch(function(e) {
            msgChain += '\npushManager: could not subscribe'

            return Promise.resolve(msgChain)
          })
        })
    } else {
      msgChain += '\npushManager: no found'

      return Promise.resolve(msgChain)
    }
  }

  /**
   * Convert url base64.
   *
   * @param   string
   * @return  array
   */
  function urlBase64ToUint8Array(base64String) {
    let padding = '='.repeat((4 - base64String.length % 4) % 4)
    let base64 = base64String + padding

    base64 = base64.replace(/-/g, '+').replace(/_/g, '/')

    let rawData = window.atob(base64)
    let outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }

    return outputArray;
  }

  /**
   * Is first access application
   * so prompt modal to reload.
   *
   * @param   string
   * @return  void
   */
  function isFirstAccess(msgChain) {
    return dbGet('settings', 'first_access')
      .then(function (firstAccess) {
        if (!firstAccess) {
          soccer.current_page = 'first-access'

          msgChain += '\nisFirstAccess: true'
        } else {
          msgChain += '\nisFirstAccess: false'
        }

        return Promise.resolve(msgChain)
      })
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
