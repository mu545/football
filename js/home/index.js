/**
 * Home index init.
 *
 * @return  void
 */
soccer.pages['home/index'] = function () {
  // open page on click home menu
  document.querySelectorAll('#HomeMenus a')
    .forEach(function (menu) {
      let pathPage = `home/${menu.getAttribute('href').substr(1)}`

      menu.addEventListener('click', function () {
        loadPage(pathPage)
          .then(function (pageContent) {
            soccer.container.innerHTML = pageContent
            soccer.pages[soccer.current_page]()
          })
          .catch(pageError)
      })
    })
}
