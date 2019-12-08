/**
 * Page league init.
 *
 * @return  void
 */
soccer.pages['league'] = function () {
  let availableLeague = [2000, 2001, 2002, 2003, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2021]
  let eListLeague = document.getElementById('ListLeague')

  footballCompetitions()
    .then(listLeague)
    .catch(function (err) {
      eListLeague.innerHTML = `
                              <p class="collection-item">no league, please load this page with internet first to get league data.</p>
                              `

      logError(err)
    })

  /**
   * Fill list league.
   *
   * @param   object  competitions json
   * @param   void
   */
  function listLeague(res) {
    let iLeauge = {}
    let hLeague = ''

    res.competitions.forEach(function (competition) {
      if (availableLeague.indexOf(competition.id) < 1) {
        return
      }

      if (typeof iLeauge[competition.area.id] === 'undefined') {
        iLeauge[competition.area.id] = true

        hLeague +=  `
                    <div class="row" style="margin-bottom: 0;">
                    <div class="col s12 red lighten-2">
                    <p class="white-text">${competition.area.name}</p>
                    </div>
                    </div>
                    `
      }

      let seasonYear = null
      let startDate = '-'
      let endDate = '-'
      let winner = '-'

      if (competition.currentSeason !== null) {
        seasonYear = new Date(competition.currentSeason.startDate)
        seasonYear = seasonYear.getFullYear()
        startDate = competition.currentSeason.startDate.replace(/\-/g, '/')
        endDate = competition.currentSeason.endDate.replace(/\-/g, '/')

        if (competition.currentSeason.winner !== null) {
          winner = competition.currentSeason.winner.name
        }
      }

      hLeague += `
                  <div class="collection-item avatar">
                    <img
                      class="circle"
                      src="/images/sport-cup.png">
                    <p class="title purple-text text-darken-4">${competition.name}</p>
                    <p><small class="grey-text text-darken-4">Season: ${startDate} - ${endDate}</small></p>
                    <p><small class="grey-text text-darken-4">Winner: ${winner}</small></p>
                    <a
                      class="secondary-content btn-small red lighten-3"
                      href="#league/detail?id=${competition.id}&season_year=${seasonYear}">&#x279f;</a>
                  </div>
                 `
    })

    eListLeague.innerHTML = hLeague
  }
}

/**
 * Page detail league init.
 *
 * @return  void
 */
soccer.pages['league/detail'] = function () {
  let eListMatchesTable = document.getElementById('ListMatchesTable')
  let matches = {}
  let competitionId = soccer.query.get('id')
  let seasonYear = soccer.query.get('season_year')

  if (competitionId === null || seasonYear === null) {
    window.location.href = '#league'

    return
  }

  footballMatches(competitionId, seasonYear)
    .then(listMatches)
    .catch(function (err) {
      eListMatchesTable.innerHTML = `
                                    <tr>
                                      <th
                                        class="center-align"
                                        colspan="3">
                                        no league, please load this page with internet first to get league data.
                                      </th>
                                    </tr>
                                    `

      logError(err)
    })

  /**
   * Fill list matches.
   *
   * @param   object    matches object json
   * @return  void
   */
  function listMatches(res) {
    let hMatches = ''

    res.matches.forEach(function (match, key) {
      hMatches += rowMatch(match, key)
    })

    eListMatchesTable.innerHTML = hMatches

    eListMatchesTable.querySelectorAll('a[href="#match-save"]')
      .forEach(function (aMatch) {
        aMatch.addEventListener('click', function () {
          saveMatch(aMatch.dataset.matchKey)
        })
      })

    matches = res.matches
  }

  /**
   * Save match to schedule.
   *
   * @param   number
   * @return  void
   */
  function saveMatch(matchKey) {
    let match = matches[matchKey]

    dbGet('matches', match.id)
      .then(function (currentMatch) {
        if (currentMatch) {
          return Promise.resolve(true)
        } else {
          return dbAdd('matches', match, match.id)
        }
      })
      .then(function () {
        M.toast({
          html: 'match added to watching schedule'
        })
      })
      .catch(function () {
        M.toast({
          html: 'match could not added to watching schedule'
        })
      })
  }
}
