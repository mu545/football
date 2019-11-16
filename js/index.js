document.addEventListener('DOMContentLoaded', function () {
  let mainPage = window.location.pathname
    .substr(1, Math.ceil(window.location.pathname.indexOf('.') - 1))
    .toLowerCase()

  if (mainPage === '' || mainPage === 'index') mainPage = 'home'

  let currentPage = window.location.hash.substr(1).toLowerCase()

  if (currentPage === '') currentPage = mainPage + '/index'

  // Activate sidebar nav
  let sideNav = M.Sidenav.init(document.getElementById('SideNav'))

  // current container
  let container = document.getElementById('Container')

  copyNav()
  loadPage(currentPage)

  /**
   * Load available navigation
   * copy navigation on top to side.
   *
   * @param   void
   */
  function copyNav() {
    document.querySelectorAll('.topnav')
      .forEach(function (nav) {
        sideNav.el.innerHTML = nav.innerHTML
      })
  }

  /**
   * Load requested page.
   *
   * @param   string
   * @return  void
   */
  function loadPage(pathPage) {
    fetch(`/pages/${pathPage}.html`)
      .then(responseStatus)
      .then(responseText)
      .then(function (data) {
        currentPage = pathPage
        container.innerHTML = data
      })
      .catch(logError)
  }
})
