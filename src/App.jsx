import { getTopArtists, getSpotifyArtistInfo } from "./scripts/music-search"
import { useState, useEffect, useRef } from "react"
import React from "react"
import ArtistCard from "./components/ArtistCard"
import StatCard from "./components/StatCard"
import FollowerFilter from "./components/FollowerFilter"
import capitalize from "./scripts/capitalize"
import clsx from "clsx"

const App = () => {
  const [username, setUsername] = useState("rafaisafar")
  const [artists, setArtists] = useState([])
  const [displayedArtists, setDisplayedArtists] = useState([])
  const [mostMainstream, setMostMainstream] = useState(null)
  const [mostNiche, setMostNiche] = useState(null)
  const [topGenre, setTopGenre] = useState(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [hiddenGenres, setHiddenGenres] = useState([])

  const [minFollowers, setMinFollowers] = useState(null)
  const [maxFollowers, setMaxFollowers] = useState(null)

  const inputRef = useRef(null)

  const loader = (
    <div className="flex items-center justify-center w-full h-full min-h-20">
      <div className="loader" />
    </div>
  )

  // handle default artist info
  useEffect(() => {
    async function getArtistInfo() {
      try {
        // get all the names
        const lastFmTopArtists = await getTopArtists(username)

        // pack image, name kv pairs in array 
        const artistInfo = await Promise.all(
          lastFmTopArtists.map(async (artistData) => {
            try {
              const spotifyArtistInfo = await getSpotifyArtistInfo(artistData.name)

              const finalData = {
                ...artistData,
                ...spotifyArtistInfo
              }

              return finalData;
            } catch (err) {
              console.error(err)
            }
          })
        )

        setArtists(artistInfo)

        // displayed artists match
        setDisplayedArtists(artistInfo)

        // set most mainstream (greatest popularity)
        setMostMainstream(
          artistInfo.reduce((max, curr) => {
            return curr.popularity > max.popularity ? curr : max;
          })
        )

        // set most niche (least popularity)
        setMostNiche(
          artistInfo.reduce((min, curr) => {
            return curr.popularity < min.popularity ? curr : min;
          })
        )

        setTopGenre(() => {
          // get top match genre for each artist
          const topGenres = artistInfo.map((info) => {
            return (info.genres && info.genres.length > 0) ? info.genres[0] : ""
          }).filter((item) => {
            return item !== ""
          })

          // basic dict freq counting
          const freqCounter = topGenres.reduce((counter, item) => {
            counter[item] = (counter[item] || 0) + 1; // add item if unseen; if not just incr. freq
            return counter;
          }, {}) // brackets are initialization of dict we use inside func

          const mostFreqItem = Object.keys(freqCounter).reduce((max, item) => {
            return freqCounter[item] > freqCounter[max] ? item : max;
          })

          return mostFreqItem;
        })
      } catch (err) {
        console.error(err)
      }
    }

    getArtistInfo()
  }, [username])

  // handle search submit
  useEffect(() => {
    // submit search on enter press
    // not on change to avoid api call abuse
    function handleSearchSubmit(e) {
      if (e.key === "Enter") {
        resetEverything()
        setUsername(e.target.value)
      }
    }

    const searchBar = inputRef.current
    if (searchBar) {
      searchBar.addEventListener("keydown", handleSearchSubmit)
    }
  }, [])

  // handle filter
  useEffect(() => {
    setDisplayedArtists(
      artists.filter((artist) => {
        // if genre data exists, apply tag filter
        if (artist.genres && artist.genres.length > 0) {
          return !hiddenGenres.includes(artist.genres[0])
        }

        // if no genre data exists, hide row by default if any hidden genre filter is applied at all 
        return !hiddenGenres.length > 0;
      }).filter((artist) => {
        // match searchterm 
        return artist.name
          .trim()
          .split(" ")
          .join("")
          .toLowerCase()
          .includes(searchTerm)
      }).filter((artist) => {
        const followCount = artist.followers

        // if no set bounds dont filter
        if (!minFollowers && !maxFollowers) {
          return true;
          // partial bound
        } else if (minFollowers && !maxFollowers) {
          return followCount >= minFollowers
        } else if (!minFollowers && maxFollowers) {
          return followCount < maxFollowers
        } else {
          return followCount >= minFollowers && followCount < maxFollowers
        }
      })
    )
  }, [hiddenGenres, artists, searchTerm, minFollowers, maxFollowers])

  const artistCards = displayedArtists.map((info, index) => {
    return (
      <ArtistCard
        key={`${index}-${info.name}`}
        data={info}
        rank={index}
      />
    )
  })

  const mostMainstreamCard = mostMainstream && (
    <StatCard
      data={mostMainstream}
      heading="Most mainstream"
    />
  )

  const mostNicheCard = mostNiche && (
    <StatCard
      data={mostNiche}
      heading="Most niche"
    />
  )

  const topGenreCard = topGenre && (
    <div className="flex flex-col items-center mb-8">
      <p>Most listened to genre</p>
      <p className="text-2xl font-bold">{topGenre ? capitalize(topGenre) : "unknown"}</p>
    </div>
  )

  function resetEverything() {
    setArtists([])
    setDisplayedArtists([])
    setMostMainstream("")
    setMostNiche("")
    setTopGenre("")
    setSearchTerm("")
    setHiddenGenres([])
  }

  function onFilterSearch(e) {
    // modify search term
    setSearchTerm(
      e.target.value
        .trim()
        .split(" ")
        .join("")
        .toLowerCase()
    )
  }

  const GenreFilter = () => {
    function toggleGenreHidden(genre) {
      // if given genre not hidden, hide it
      if (!hiddenGenres.includes(genre)) {
        setHiddenGenres((prev) => [...prev, genre])
        // if it is hidden, unhide it
      } else {
        setHiddenGenres((prev) => {
          // remove passed genre from list...
          return prev.filter((item) => item !== genre)
        })
      }
    }

    const FilterButton = ({ genre }) => {
      const bgColor = clsx(
        hiddenGenres.includes(genre) ? "bg-red-700" : "bg-green-700"
      )

      return (
        <button
          onClick={() => toggleGenreHidden(genre)}
          className={`${bgColor} bg-green-700 rounded-lg`}>
          <p className="p-3 w-full font-bold">{capitalize(genre)}</p>
        </button>
      )
    }

    // get unique genres
    const uniqueGenres = artists.map((artist) => {
      if (artist.genres && artist.genres.length > 0) {
        return artist.genres[0]
      }

      return null;
    }).reduce((arr, curr) => {
      if (curr !== null && !arr.includes(curr)) {
        arr.push(curr)
      }

      return arr;
    }, [])

    // add genre filters
    const genreFilters = uniqueGenres.map((genre, index) => {
      return (
        <FilterButton key={`${genre}-${index}`} genre={genre} />
      )
    })

    return (
      <div className="fixed left-0 bottom-0 w-50 h-min bg-gray-900 rounded-2xl p-2">
        <p className="text-center mb-2">Click a genre to hide it</p>
        <div className="flex flex-col w-full gap-2">
          {uniqueGenres.length > 0 ? genreFilters : loader}
        </div>
      </div>
    )
  }


  return (
    <div className="relative flex flex-col items-center text-white p-12 bg-black">
      <GenreFilter />
      <FollowerFilter setMinFollowers={setMinFollowers} setMaxFollowers={setMaxFollowers} />
      <h1 className="text-4xl font-extrabold m-4">
        #MyTop12
      </h1>
      <p className="m-3">Enter someone's LastFM username to know what they've been listening to!</p>
      <input
        type="text"
        placeholder="rafaisafar"
        ref={(me) => inputRef.current = me}
        className="text-center text-black focus:outline-none border-0 m-4 p-2 bg-white rounded-full placeholder:text-gray-500 placeholder:font-normal"
      />

      {
        artists.length > 0 ? (
          <div>
            <div className="flex flex-col items-center">
              <div className="flex justify-center">
                {mostMainstreamCard}
                {mostNicheCard}
              </div>
              {topGenreCard}
              <input
                type="text"
                placeholder="Filter search..."
                onChange={onFilterSearch}
                className="text-center pl-4 text-white focus:outline-none border-0 p-1 bg-gray-900 rounded-2xl placeholder:text-gray-600 mb-10"
              />
            </div>
            <table className="border-separate border-spacing-2">
              <thead>
                <tr className="text-center text-gray-500">
                  <th className="min-w-50">Artist</th>
                  <th className="min-w-30">Play Count</th>
                  <th className="min-w-30">Genre</th>
                  <th className="min-w-30">Followers</th>
                </tr>
              </thead>
              <tbody>
                {artistCards}
              </tbody>
            </table>
          </div>
        ) : loader

      }
    </div>
  )
}

export default App
