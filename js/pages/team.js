/**
 * Page team init.
 *
 * @return  void
 */
soccer.pages['team'] = function () {
  let eListPlayer = document.getElementById('ListPlayerTable')
  let team = {}
  let teamId = soccer.query.get('id')

  if (teamId === null) {
    window.location.href = '#league'

    return
  }

  footballTeam(teamId)
    .then(function (res) {
      teamInfo(res.team)
      listPlayer(res.team.squad)
      team = res.team
    })
    .catch(function (err) {
      eListPlayer.innerHTML = `
                              <tr>
                                <th
                                  class="center-align"
                                  colspan="2">
                                  no team, please load this page with internet first to get team information.
                                </th>
                              </tr>
                              `

      logError(err)
    })

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
