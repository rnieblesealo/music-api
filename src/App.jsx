import { getTopArtists, getSpotifyArtistInfo } from "./scripts/music-search"
import { useState, useEffect, useRef } from "react"
import capitalize from "./scripts/capitalize"
import React from "react"
import ArtistCard from "./components/ArtistCard"
import StatCard from "./components/StatCard"
import FollowerFilter from "./components/FollowerFilter"
import Loader from "./components/Loader"
import GenreFilter from "./components/GenreFilter"

import { FaLastfmSquare } from "react-icons/fa"

const App = () => {
  /* -- GENERAL --------- */
  const [username, setUsername] = useState("rafaisafar")
  const [artists, setArtists] = useState([])
  const [displayedArtists, setDisplayedArtists] = useState([])

  /* -- SUMMARY STATS --  */
  const [mostMainstream, setMostMainstream] = useState(null)
  const [mostNiche, setMostNiche] = useState(null)
  const [topGenre, setTopGenre] = useState(null)

  /* -- FILTERING ------- */
  const [searchTerm, setSearchTerm] = useState("")
  const [hiddenGenres, setHiddenGenres] = useState([])
  const [minFollowers, setMinFollowers] = useState(null)
  const [maxFollowers, setMaxFollowers] = useState(null)

  const inputRef = useRef(null)

  // fetch initial artist info 
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

        // set all artist info 
        setArtists(artistInfo)

        // match displayed artists with fetched artist info 
        setDisplayedArtists(artistInfo)

        // get most mainstream (highest popularity)
        setMostMainstream(
          artistInfo.reduce((max, curr) => {
            return curr.popularity > max.popularity ? curr : max;
          })
        )

        // set most niche (lowest popularity)
        setMostNiche(
          artistInfo.reduce((min, curr) => {
            return curr.popularity < min.popularity ? curr : min;
          })
        )

        // set top genre (most frequently ocurring first genre entry)
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

  // fetch newly searched info
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

  // handle display filtering 
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

        // if no set bounds...
        if (!minFollowers && !maxFollowers) {
          // ...don't hide anything, regardless of follower count info
          return true;

          // however, if any bound is set...
        } else {
          // ...and follow count info doesn't exist, hide the row; we want to see strictly what we're looking for! 
          if (!followCount) {
            return false;
            // and of course, if follower bounds and follow count exist, test normally :)
          } else {
            if (minFollowers && !maxFollowers) {
              return followCount >= minFollowers
            } else if (!minFollowers && maxFollowers) {
              return followCount < maxFollowers
            } else {
              return followCount >= minFollowers && followCount < maxFollowers
            }
          }
        }
      })
    )
  }, [hiddenGenres, artists, searchTerm, minFollowers, maxFollowers])

  const artistCards = displayedArtists?.map((info, index) => {
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

  return (
    <div className="relative flex flex-col items-center text-white p-12 bg-black">
      <GenreFilter
        artists={artists}
        hiddenGenres={hiddenGenres}
        setHiddenGenres={setHiddenGenres}
      />
      <FollowerFilter setMinFollowers={setMinFollowers} setMaxFollowers={setMaxFollowers} />
      <h1 className="text-4xl font-extrabold m-4 flex gap-2 items-center">
        #MyTop12 <FaLastfmSquare />
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
        ) : <Loader />

      }
    </div>
  )
}

export default App
