/**
 * Home team detail init.
 *
 * @param   object
 * @return  void
 */
soccer.pages['home/team-detail'] = function (query) {
  let eListPlayer = document.getElementById('ListPlayerTable')
  let team = {}

  if (typeof query === 'undefined') {
    window.location.href = '/index.html?#league'

    return
  }

  footballTeam(query.id)
    .then(function (res) {
      teamInfo(res.team)
      listPlayer(res.team.squad)
      team = res.team
    })
    .catch(logError)

  document.getElementById('Back')
    .addEventListener('click', query.back)

  document.getElementById('TeamSave')
    .addEventListener('click', function () {
      dbGet('teams', team.id)
        .then(function (currentTeam) {
          if (currentTeam) {
            return Promise.resolve(true)
          } else {
            return dbAdd('teams', team, team.id)
          }
        })
        .then(function () {
          M.toast({
            html: 'team added to favorite'
          })
        })
        .catch(function (ee) {
          M.toast({
            html: 'team could not added to favorite'
          })
        })
    })

  /**
   * Fill team information.
   *
   * @param   object
   * @return  void
   */
  function teamInfo(teamInfo) {
    document.getElementById('TeamName').innerHTML = teamInfo.name
    document.getElementById('TeamEmail').innerHTML = `Email: ${teamInfo.email}`
    document.getElementById('TeamPhone').innerHTML = `Phone: ${teamInfo.phone}`
  }

  /**
   * Fill list player.
   *
   * @param   object
   * @return  void
   */
  function listPlayer(teamSquad) {
    let hListPlayer = ''

    teamSquad.forEach(function (player) {
      hListPlayer += rowPlayer(player)
    })

    eListPlayer.innerHTML = hListPlayer
  }
}
