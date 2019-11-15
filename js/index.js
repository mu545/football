document.addEventListener('DOMContentLoaded', function () {
  let currentPage = window.location.hash.substr(1).toLowerCase()

  if (currentPage === '') currentPage = 'home'

  // Activate sidebar nav
  let sideNav = M.Sidenav.init(document.getElementById('SideNav'))

  // current container
  let container = document.getElementById('Container')

  loadNav()
  loadPage(currentPage)

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
   * Load available navigation
   * fill loaded navigation to nav.
   *
   * @param   void
   */
  function loadNav() {
    fetch('/nav.html')
      .then(responseStatus)
      .then(responseText)
      .then(function (data) {
        document.querySelectorAll('.topnav, .sidenav')
          .forEach(function (nav) {
            nav.innerHTML = data
          })

        // load page on navigation clicked
        document.querySelectorAll('.brand-logo, .topnav a, .sidenav a')
          .forEach(function (navigation) {
            navigation.addEventListener('click', function () {
              loadPage(navigation.getAttribute('href').substr(1))
            })
          })
      })
      .catch(logError)
  }

  /**
   * Load requested page.
   *
   * @param   string
   * @return  void
   */
  function loadPage(pageName) {
    fetch(`/pages/${pageName}.html`)
      .then(responseStatus)
      .then(responseText)
      .then(function (data) {
        currentPage = pageName
        container.innerHTML = data
      })
      .catch(logError)
  }
})
