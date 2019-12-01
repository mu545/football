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
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function () {
        console.log('Service worker: registered')
        loadCurrentPage()
      })
      .catch(function () {
        console.log('Service worker: could not be registered')
        loadCurrentPage()
      })
  } else {
    console.log('Service worker: browser not support')
    loadCurrentPage()
  }

  /**
   * Load current page
   * fill content to container and run page init.
   *
   * @return  void
   */
  function loadCurrentPage() {
    loadPage()
      .then(function (pageContent) {
        soccer.container.innerHTML = pageContent
        soccer.pages[soccer.current_page]()
      })
      .catch(pageError)
  }
})
