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
      let matchDate = new Date(match.utcDate)
      let matchMonth = matchDate.getMonth()
      matchMonth = matchMonth < 10 ? '0' + matchMonth : matchMonth
      let matchDay = matchDate.getDate()
      matchDay = matchDay < 10 ? '0' + matchDay : matchDay
      let matchYear = matchDate.getFullYear()
      matchYear = matchYear % 100
      let matchHour = matchDate.getHours()
      let matchMinute = matchDate.getMinutes()
      let matchClock = 'AM'
      let awayScore = 0
      let homeScore = 0

      if (matchHour > 12 || (matchHour === 12 && matchMinute > 0)) {
        matchHour = matchHour % 12
        matchClock = 'PM'
      }

      if (matchHour < 10) {
        matchHour = '0' + matchHour
      }

      if (matchMinute < 10) {
        matchMinute = '0' + matchMinute
      }

      if (match.score.extraTime.awayTeam && match.score.extraTime.homeTeam) {
        awayScore += match.score.extraTime.awayTeam
        homeScore += match.score.extraTime.homeTeam
      }

      if (match.score.fullTime.awayTeam && match.score.fullTime.homeTeam) {
        awayScore += match.score.fullTime.awayTeam
        homeScore += match.score.fullTime.homeTeam
      }

      if (match.score.halfTime.awayTeam && match.score.halfTime.homeTeam) {
        awayScore += match.score.halfTime.awayTeam
        homeScore += match.score.halfTime.homeTeam
      }

      if (match.score.penalties.awayTeam && match.score.penalties.homeTeam) {
        awayScore += match.score.penalties.awayTeam
        homeScore += match.score.penalties.homeTeam
      }

      hMatches = `
                    <tr>
                      <td>
                        <a
                          class="purple-text text-darken-4"
                          href="#team-detail"
                          data-team-id="${match.awayTeam.id}">${match.awayTeam.name}</a>
                      </td>
                      <td>
                        <a
                          class="purple-text text-darken-4"
                          href="#match-save"
                          data-match-key="${key}">
                          <p>${awayScore} : ${homeScore}</p>
                          <p>${matchMonth}/${matchDay}/${matchYear}</p>
                          <p>${matchHour}:${matchMinute} ${matchClock}</p>
                        </a>
                      </td>
                      <td>
                        <a
                          class="purple-text text-darken-4"
                          href="#team-detail"
                          data-team-id="${match.homeTeam.id}">${match.homeTeam.name}</a>
                      </td>
                    </tr>
                  ` + hMatches
    })

    eListMatchesTable.innerHTML = hMatches

    matches = res.matches
  }
}
