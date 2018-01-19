let appended = []
class MovieFetcher {
  constructor (t) {
    this.token = t
  }

  async searchTmdb (query, tmdbToken = this.token) {
    let res = await $.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${tmdbToken}&query=${query}`
    )
    return res.results[0]
  }

  async getTmdbDetails (id, swedish = false, tmdbToken = this.token) {
    if (!swedish) {
      let res = await $.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbToken}&append_to_response=videos,credits,images`
      ) // &language=sv-SE
      return res
    } else {
      let res = await $.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbToken}&append_to_response=videos,credits,images&language=sv-SE`
      )
      return res
    }
  }

  static async getPlotFromMoviezine (title) {
    let slugTitle = titleToSlug(title)
    let searchItem = await $.get('https://www.moviezine.se/movies/' + slugTitle)
      .then(res => {
        return res
      })
      .catch(res => {
        return $.get(
          'http://allorigins.me/get?url=' +
            encodeURIComponent('https://www.moviezine.se/movies/' + slugTitle)
        )
      })
    let regex = /<div class='plot'>([\s\S]*?)<\/div>/i
    try {
      let plot = regex.exec(searchItem.contents)[1]
      return plot
    } catch (error) {
      return null
    }
  }
}

$('#swedishTitleCheckbox').change(function () {
  $('#swedishTitle').prop('disabled', !$(this).is(':checked'))
})

$('#submit').click(async function (event) {
  event.preventDefault()

  let token = $('#inputToken').val()
  // @ts-ignore
  if (token.length === 32) {
    let fetcher = new MovieFetcher($('#inputToken').val())
    let res = await fetcher.searchTmdb($('#inputSearch').val())
    // console.log(res)
    let deetz = await fetcher.getTmdbDetails(res.id)

    $('#swedishPlotWarning').text('')
    let swedishPlot
    let swedishTitle
    /* = await MovieFetcher.getPlotFromMoviezine(
      $('#swedishTitleCheckbox').is(':checked')
        ? $('#swedishTitle').val()
        : deetz.original_title
    ) */
    // await MovieFetcher.getPlotFromMoviezine(
    //   swedishDeetz.title
    // )
    // Get the Swedish title
    let swedishDeetz = await fetcher.getTmdbDetails(res.id, true)
    swedishPlot = swedishDeetz.overview
    swedishTitle = swedishDeetz.title
    if (swedishPlot === null) {
      swedishPlot = await MovieFetcher.getPlotFromMoviezine(
        $('#swedishTitleCheckbox').is(':checked')
          ? $('#swedishTitle').val()
          : swedishTitle || deetz.original_title
      )
    }
    if (
      typeof swedishTitle !== 'undefined' &&
      swedishTitle.length > 0 &&
      !$('#swedishTitleCheckbox').is(':checked')
    ) {
      Object.assign(deetz, { title_sv: swedishTitle.trim() })
    } else if ($('#swedishTitleCheckbox').is(':checked')) {
      Object.assign(deetz, { title_sv: $('#swedishTitle').val() })
    }
    if (swedishPlot !== null) {
      Object.assign(deetz, { plot_sv: swedishPlot.trim() })
    } else {
      $('#swedishPlotWarning').text('Note: could not find Swedish plot')
    }

    // console.log(deetz)
    renderImages([deetz.poster_path, deetz.backdrop_path])
    // @ts-ignore
    $('#json-renderer').jsonViewer(deetz, {
      collapsed: true,
      withQuotes: false
    })
    $('#json-raw').text(JSON.stringify(deetz, null, '  '))
    $('#append').prop('disabled', false)
    $('#append').unbind('click')
    $('#append').click(function (event) {
      $('#append').prop('disabled', true)
      event.preventDefault()
      // console.log(appended)
      $('#jsonflex-save-submit').prop('disabled', false)
      appended.push(deetz)
      $('#json-renderer-save').html('')
      // @ts-ignore
      $('#json-renderer-save').jsonViewer(appended, {
        collapsed: true,
        withQuotes: false
      })
      $('#json-raw-save').text(JSON.stringify(appended, null, '  '))
      $('#jsonflex-save-submit').click(function () {
        if (
          $('#jsonflex-save')
            .val()
            .toString().length > 0
        ) {
          // @ts-ignore
          JSON._save($('#jsonflex-save').val(), appended)
          $('#confirm').append(
            'Saved in /json/' + $('#jsonflex-save').val() + '.json'
          )
        }
      })
    })
  }
})

function renderImages (paths) {
  let imghtml = ''
  paths.forEach(path => {
    imghtml = imghtml.concat(
      `<img src="https://image.tmdb.org/t/p/original${path}">\n`
    )
  })
  console.log(imghtml)
  $('#images').html(imghtml)
}

function titleToSlug (title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // öäå -> oaa
    .trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W-]+/g, '-')
}
