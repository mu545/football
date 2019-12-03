/**
 * Home schedule init.
 *
 * @return  void
 */
soccer.pages['home/schedule'] = function () {
  let eListsMatchesTable = document.getElementById('ListMatchesTable')
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
        eListsMatchesTable.innerHTML = hMatches

        eListsMatchesTable.querySelectorAll('a[href="#match-save"]')
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
