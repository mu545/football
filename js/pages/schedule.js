/**
 * Page schedule init.
 *
 * @return  void
 */
soccer.pages['schedule'] = function () {
  let eListMatchesTable = document.getElementById('ListMatchesTable')
  let matches = {
    total: 0
  }

  listMatches()

  /**
   * Fill list matches.
   *
   * @return  void
   */
  function listMatches() {
    let hMatches = ''

    dbCursor('matches')
      .then(function readMatch(matchCursor) {
        if (matchCursor) {
          matches[matches.total] = matchCursor.value
          hMatches += rowMatch(matchCursor.value, matches.total)
          matches.total += 1

          return Promise.resolve(
            matchCursor.continue()
              .then(readMatch)
          )
        } else {
          return
        }
      })
      .then(function () {
        if (matches.total < 1) {
          eListMatchesTable.innerHTML = `
                                        <tr>
                                          <th
                                            class="center-align"
                                            colspan="4">
                                            no schedule saved.
                                          </th>
                                        </tr>
                                        `

          return
        }

        eListMatchesTable.innerHTML = hMatches

        eListMatchesTable.querySelectorAll('button[data-match-key]')
          .forEach(function (btnMatch) {
            btnMatch.addEventListener('click', function () {
              removeMatch(btnMatch)
            })
          })
      })
  }

  /**
   * Remove match from schedule.
   *
   * @param   dom
   * @return  void
   */
  function removeMatch(btnMatch) {
    let match = matches[btnMatch.dataset.matchKey]

    dbDelete('matches', match.id)
      .then(function () {
        M.toast({
          html: 'match removed from watching schedule'
        })

        btnMatch.parentNode.parentNode.parentNode
          .removeChild(btnMatch.parentNode.parentNode)

        delete matches[btnMatch.dataset.matchKey]
      })
      .catch(function () {
        M.toast({
          html: 'match could not removed from watching schedule'
        })
      })
  }
}
