/**
 * Home favorite init.
 *
 * @return  void
 */
soccer.pages['home/favorite'] = function () {
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
        eListTeamsTable.innerHTML = hTeams

        eListTeamsTable.querySelectorAll('a[href="#team-save"]')
          .forEach(function (aTeam) {
            aTeam.addEventListener('click', function () {
              removeTeam(aTeam)
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
  function removeTeam(aTeam) {
    let team = teams[aTeam.dataset.teamKey]

    dbDelete('teams', team.id)
      .then(function () {
        M.toast({
          html: 'team removed from favorite'
        })

        aTeam.parentNode.parentNode.parentNode
          .removeChild(aTeam.parentNode.parentNode)

        delete teams[aTeam.dataset.teamKey]
      })
      .catch(function () {
        M.toast({
          html: 'team could not removed from favorite'
        })
      })
  }
}
