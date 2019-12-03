/**
 * Home league init.
 *
 * @return  void
 */
soccer.pages['home/league'] = function () {
  let availableLeague = [2000, 2001, 2002, 2003, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2021]
  let eListLeague = document.getElementById('ListLeague')

  footballCompetitions()
    .then(listLeague)
    .catch(logError)

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

        hLeague += `
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
                      href="#league-detail"
                      data-competition-id="${competition.id}"
                      data-season-year="${seasonYear}">&#x279f;</a>
                  </div>
                 `
    })

    eListLeague.innerHTML = hLeague

    eListLeague.querySelectorAll('.collection-item a')
      .forEach(function (aLeague) {
        aLeague.addEventListener('click', detailLeague, false)
      })
  }

  /**
   * Get detail a league.
   *
   * @param   dom
   * @return  void
   */
  function detailLeague(e) {
    loadPage('home/league-detail')
      .then(function (pageContent) {
        let dataset = e.target.dataset

        soccer.container.innerHTML = pageContent
        soccer.pages[soccer.current_page]({
          id: dataset.competitionId,
          season_year: dataset.seasonYear
        })
      })
      .catch(pageError)
  }
}

/**
 * Home detail league init.
 *
 * @param   object
 * @return  void
 */
soccer.pages['home/league-detail'] = function (query) {
  let eListMatchesTable = document.getElementById('ListMatchesTable')
  let matches = {}

  if (typeof query === 'undefined') {
    window.location.href = '/index.html?#league'

    return
  }

  footballMatches(query.id, query.season_year)
    .then(listMatches)
    .catch(logError)

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
