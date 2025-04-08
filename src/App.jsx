import { getTopArtists, getSpotifyArtistInfo } from "./scripts/music-search"
import { useState, useEffect, useRef } from "react"
import ArtistCard from "./components/ArtistCard"
import StatCard from "./components/StatCard"
import capitalize from "./scripts/capitalize"

const App = () => {
  const [username, setUsername] = useState("rafaisafar")
  const [artists, setArtists] = useState([])
  const [displayedArtists, setDisplayedArtists] = useState([])
  const [mostMainstream, setMostMainstream] = useState(null)
  const [mostNiche, setMostNiche] = useState(null)
  const [topGenre, setTopGenre] = useState(null)

  const inputRef = useRef(null)

  const loader = (
    <div className="flex items-center justify-center w-full h-full min-h-50">
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
        setArtists([])
        setUsername(e.target.value)
      }
    }

    const searchBar = inputRef.current
    if (searchBar) {
      searchBar.addEventListener("keydown", handleSearchSubmit)
    }
  }, [])

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
  }

  function onFilterSearch(e) {
    setDisplayedArtists(
      artists.filter((artist) => {
        // character-wise lowercase saerch
        const searchTerm = e.target.value
          .trim()
          .split(" ")
          .join("")
          .toLowerCase()

        return artist.name
          .trim()
          .split(" ")
          .join("")
          .toLowerCase()
          .includes(searchTerm)
      })
    )
  }

  return (
    <div className="flex flex-col items-center text-white p-12 bg-black">
      <h1 className="text-4xl font-extrabold m-4">
        #MyTop12
      </h1>
      <p className="m-3">Enter someone's username to find out their top 12 on LastFM!</p>
      <input
        type="text"
        placeholder="rafaisafar"
        ref={(me) => inputRef.current = me}
        className="text-center text-black focus:outline-none border-0 m-4 p-2 bg-white rounded-full placeholder:text-gray-500"
      />

      {
        displayedArtists.length > 0 ? (
          <>
            <div>
              <div className="flex">
                {mostMainstreamCard}
                {mostNicheCard}
              </div>
              {topGenreCard}
            </div>
            <input
              type="text"
              placeholder="Filter search..."
              onChange={onFilterSearch}
              className="text-center text-black focus:outline-none border-0 m-4 p-2 bg-white rounded-full placeholder:text-gray-500"
            />
            <table className="border-separate border-spacing-2">
              <thead>
                <tr className="text-center">
                  <th className="min-w-50">Artist</th>
                  <th className="min-w-30">Play Count</th>
                  <th className="min-w-30">Genre</th>
                  <th className="min-w-30">Followers</th>
                  <th className="min-w-30">Popularity</th>
                </tr>
              </thead>
              <tbody>
                {artistCards}
              </tbody>
            </table>
          </>
        ) : loader
      }
    </div>
  )
}

export default App
