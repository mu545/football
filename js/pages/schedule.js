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
                                            colspan="3">
                                            no schedule saved.
                                          </th>
                                        </tr>
                                        `

          return
        }

        eListMatchesTable.innerHTML = hMatches

        eListMatchesTable.querySelectorAll('a[href="#match-save"]')
          .forEach(function (aMatch) {
            aMatch.addEventListener('click', function () {
              removeMatch(aMatch)
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
  function removeMatch(aMatch) {
    let match = matches[aMatch.dataset.matchKey]

    dbDelete('matches', match.id)
      .then(function () {
        M.toast({
          html: 'match removed from watching schedule'
        })

        aMatch.parentNode.parentNode.parentNode
          .removeChild(aMatch.parentNode.parentNode)

        delete matches[aMatch.dataset.matchKey]
      })
      .catch(function () {
        M.toast({
          html: 'match could not removed from watching schedule'
        })
      })
  }
}
