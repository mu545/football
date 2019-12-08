/**
 * Page first access init.
 *
 * @return  void
 */
soccer.pages['first-access'] = function () {
  document.getElementById('FirstAccessBtn')
    .addEventListener('click', function () {
      dbAdd('settings', true, 'first_access')
        .then(function () {
          window.location.reload()
        })
    })
}
