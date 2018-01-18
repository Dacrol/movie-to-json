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

  async getTmdbDetails (id, tmdbToken = this.token) {
    let res = await $.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbToken}&append_to_response=videos,credits`
    ) // &language=sv-SE
    return res
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
    let plot = regex.exec(searchItem.contents)[1]
    return plot
  }

  static generateJSON (details) {
    return [
      {
        title: '',
        productionCountries: ['Italien', 'USA'],
        productionYear: 2017,
        length: 132,
        genre: 'Drama',
        distributor: 'UIP',
        language: 'engelska',
        subtitles: 'svenska',
        director: 'Luca Guadagnino',
        actors: ['Armie Hammer', 'Timothée Chalamet', 'Michael Stuhlbarg'],
        description:
          '<p>Filmen utspelas i norra Italien sommaren 1983. En ung amerikansk-italienare blir förälskad i en amerikansk student som kommer för att studera och bo hos hans familj.</p><p>Tillsammans upplever de en oförglömlig sommar - full av musik, mat och kärlek - som för evigt kommer att förändra dem.</p>',
        images: ['call-me-poster1.jpg', 'call-me-poster2.jpg'],
        youtubeTrailers: ['Z9AYPxH5NTM'],
        reviews: [
          {
            source: 'Sydsvenskan',
            quote: 'ett drama berättat med stor ömhet',
            stars: 4,
            max: 5
          },
          {
            source: 'Svenska Dagbladet',
            quote: 'en film att förälska sig i',
            stars: 5,
            max: 5
          },
          {
            source: 'DN',
            quote: 'en het romans i åttiotalskostym',
            stars: 4,
            max: 5
          }
        ]
      }
    ]
  }
}

$('button').click(async function (event) {
  event.preventDefault()

  let token = $('#inputToken').val()
  // @ts-ignore
  if (token.length === 32) {
    let fetcher = new MovieFetcher($('#inputToken').val())
    let res = await fetcher.searchTmdb($('#inputSearch').val())
    console.log(res)
    let deetz = await fetcher.getTmdbDetails(res.id)
    console.log(deetz)
    $('#json-renderer').jsonViewer(deetz, {
      collapsed: true,
      withQuotes: false
    })
    $('#json-raw').text(JSON.stringify(deetz, null, '  '))
  }
})

function titleToSlug (title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W-]+/g, '-')
}

/* {
  "adult": false,
  "backdrop_path": "/iB0RsWVoOXzicPi2Yy5xmTYMbho.jpg",
  "belongs_to_collection": {
      "id": 363369,
      "name": "Pacific Rim Collection",
      "poster_path": "/niTMK5k486sPBCphbvmRIZ7xBGK.jpg",
      "backdrop_path": "/vbg4Mm8auNINPersFlYvyGLqFq0.jpg"
  },
  "budget": 180000000,
  "genres": [
      {
          "id": 28,
          "name": "Action"
      },
      {
          "id": 878,
          "name": "Science Fiction"
      },
      {
          "id": 12,
          "name": "Äventyr"
      }
  ],
  "homepage": "",
  "id": 68726,
  "imdb_id": "tt1663662",
  "original_language": "en",
  "original_title": "Pacific Rim",
  "overview": "När stora monster stiger upp från haven inleddes ett krig som kostar miljontals liv. För att bekämpa dessa Kaijus, skapar man jättelika robotar, sk Jaegers som styrs av två piloter. Men även dessa har problem med de hänsynslösa Kaijus. På gränsen till ett förödande nederlag vänder man sig till två osannolika hjältar. En före detta pilot och en ung tjej är plötsligt mänsklighetens sista hopp inför den stundande apokalypse.",
  "popularity": 79.444383,
  "poster_path": "/sCJEwEShZvruTpQ2a4yiX3Q9EyZ.jpg",
  "production_companies": [
      {
          "name": "Legendary Pictures",
          "id": 923
      },
      {
          "name": "Warner Bros.",
          "id": 6194
      },
      {
          "name": "Disney Double Dare You (DDY)",
          "id": 19750
      },
      {
          "name": "Indochina Productions",
          "id": 19751
      }
  ],
  "production_countries": [
      {
          "iso_3166_1": "US",
          "name": "United States of America"
      },
      {
          "iso_3166_1": "CA",
          "name": "Canada"
      }
  ],
  "release_date": "2013-07-11",
  "revenue": 407602906,
  "runtime": 131,
  "spoken_languages": [
      {
          "iso_639_1": "en",
          "name": "English"
      }
  ],
  "status": "Released",
  "tagline": "",
  "title": "Pacific Rim",
  "video": false,
  "vote_average": 6.7,
  "vote_count": 5407,
  "videos": {
      "results": [
          {
              "id": "533ec6bfc3a36854480069bc",
              "iso_639_1": "sv",
              "iso_3166_1": "SE",
              "key": "2vKz7WnU83E",
              "name": "Trailer",
              "site": "YouTube",
              "size": 720,
              "type": "Trailer"
          }
      ]
  },
  "images": {
      "backdrops": [],
      "posters": []
  }
}
 */
/*       "vote_count": 5403,
      "id": 68726,
      "video": false,
      "vote_average": 6.7,
      "title": "Pacific Rim",
      "popularity": 80.444383,
      "poster_path": "/sCJEwEShZvruTpQ2a4yiX3Q9EyZ.jpg",
      "original_language": "en",
      "original_title": "Pacific Rim",
      "genre_ids": [
        28,
        878,
        12
      ],
      "backdrop_path": "/iB0RsWVoOXzicPi2Yy5xmTYMbho.jpg",
      "adult": false,
      "overview": "When legions of monstrous creatures, known as Kaiju, started rising from the sea, a war began that would take millions of lives and consume humanity's resources for years on end. To combat the giant Kaiju, a special type of weapon was devised: massive robots, called Jaegers, which are controlled simultaneously by two pilots whose minds are locked in a neural bridge. But even the Jaegers are proving nearly defenseless in the face of the relentless Kaiju. On the verge of defeat, the forces defending mankind have no choice but to turn to two unlikely heroes—a washed-up former pilot (Charlie Hunnam) and an untested trainee (Rinko Kikuchi)—who are teamed to drive a legendary but seemingly obsolete Jaeger from the past. Together, they stand as mankind's last hope against the mounting apocalypse.",
      "release_date": "2013-07-11" */

/* [
  {
    "title": "Call me by your name",
    "productionCountries": [
      "Italien",
      "USA"
    ],
    "productionYear": 2017,
    "length": 132,
    "genre": "Drama",
    "distributor": "UIP",
    "language": "engelska",
    "subtitles": "svenska",
    "director": "Luca Guadagnino",
    "actors": [
      "Armie Hammer",
      "Timothée Chalamet",
      "Michael Stuhlbarg"
    ],
    "description": "<p>Filmen utspelas i norra Italien sommaren 1983. En ung amerikansk-italienare blir förälskad i en amerikansk student som kommer för att studera och bo hos hans familj.</p><p>Tillsammans upplever de en oförglömlig sommar - full av musik, mat och kärlek - som för evigt kommer att förändra dem.</p>",
    "images": [
       "call-me-poster1.jpg",
       "call-me-poster2.jpg"
    ],
    "youtubeTrailers": [
      "Z9AYPxH5NTM"
    ],
    "reviews": [
      {
        "source": "Sydsvenskan",
        "quote": "ett drama berättat med stor ömhet",
        "stars": 4,
        "max": 5
      },
      {
        "source": "Svenska Dagbladet",
        "quote": "en film att förälska sig i",
        "stars": 5,
        "max": 5
      },
      {
        "source": "DN",
        "quote": "en het romans i åttiotalskostym",
        "stars": 4,
        "max": 5
      }
    ]
  }
] */
