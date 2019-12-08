/**
 * Page favorite init.
 *
 * @return  void
 */
soccer.pages['favorite'] = function () {
  let eListTeamsTable = document.getElementById('ListTeamsTable')
  let teams = {
    total: 0
  }

  listTeams()

  /**
   * Fill list teams.
   *
   * @return  void
   */
  function listTeams() {
    let hTeams = ''

    dbCursor('teams')
      .then(function readTeam(teamCursor) {
        if (teamCursor) {
          teams[teams.total] = teamCursor.value
          hTeams += rowTeam(teamCursor.value, teams.total)
          teams.total += 1

          return Promise.resolve(
            teamCursor.continue()
              .then(readTeam)
          )
        } else {
          return
        }
      })
      .then(function () {
        if (teams.total < 1) {
          eListTeamsTable.innerHTML = `
                                      <tr>
                                        <td
                                          class="center-align"
                                          colspan="2">
                                          no favorite team.
                                        </td>
                                      </tr>
                                      `

          return
        }

        eListTeamsTable.innerHTML = hTeams

        eListTeamsTable.querySelectorAll('button[data-team-key]')
          .forEach(function (btnTeam) {
            btnTeam.addEventListener('click', function () {
              removeTeam(btnTeam)
            })
          })
      })
  }

  /**
   * Remove team from schedule.
   *
   * @param   dom
   * @return  void
   */
  function removeTeam(btnTeam) {
    let team = teams[btnTeam.dataset.teamKey]

    dbDelete('teams', team.id)
      .then(function () {
        M.toast({
          html: 'team removed from favorite'
        })

        btnTeam.parentNode.parentNode.parentNode
          .removeChild(btnTeam.parentNode.parentNode)

        delete teams[btnTeam.dataset.teamKey]
      })
      .catch(function () {
        M.toast({
          html: 'team could not removed from favorite'
        })
      })
  }
}
