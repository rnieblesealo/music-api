import { getTopArtists, getSpotifyArtistInfo } from "../scripts/music-search"
import { useState, useEffect, useRef } from "react"
import React from "react"
import ArtistCard from "../components/ArtistCard"
import StatCard from "../components/StatCard"
import FollowerFilter from "../components/FollowerFilter"
import Loader from "../components/Loader"
import GenreFilter from "../components/GenreFilter"
import capitalize from "../scripts/capitalize"

import { FaLastfmSquare } from "react-icons/fa"
import { FaSadTear } from "react-icons/fa";

import { LineChart, Line, CartesianGrid, XAxis, YAxis, BarChart, Bar } from "recharts"

const Dashboard = () => {
  /* -- GENERAL --------- */
  const [username, setUsername] = useState("rafaisafar")
  const [artists, setArtists] = useState([])
  const [displayedArtists, setDisplayedArtists] = useState([])

  /* -- SUMMARY STATS --  */
  const [mostMainstream, setMostMainstream] = useState({})
  const [mostNiche, setMostNiche] = useState({})
  const [topGenre, setTopGenre] = useState("")

  /* -- FILTERING ------- */
  const [searchTerm, setSearchTerm] = useState("")
  const [hiddenGenres, setHiddenGenres] = useState([])
  const [minFollowers, setMinFollowers] = useState(0)
  const [maxFollowers, setMaxFollowers] = useState(0)

  const [didFindArtistData, setDidFindArtistData] = useState(true)

  /* -- CHART DATA ------ */
  const [popVsListens, setPopVsListens] = useState([])
  const [genreFreqs, setGenreFreqs] = useState([])

  const inputRef = useRef(null)

  const UserNotFoundPlaceholder = () => {
    return (
      <p className="flex flex-col items-center justify-center text-red-400 font-bold">
        <span className="flex items-center justify-center">
          Could not fetch user data
          <span className="ml-2">
            <FaSadTear />
          </span>
        </span>
        <br />
        Make sure you typed a valid LastFM username!
      </p>
    )
  }

  // fetch info for given username
  useEffect(() => {
    async function getArtistInfo() {
      try {
        // get all the names
        const lastFmTopArtists = await getTopArtists(username)

        if (!lastFmTopArtists || lastFmTopArtists.length === 0) {
          throw new Error("LastFM artist data is null!")
        }

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

          // take advantage of counted freqs to set genre distribution data in rechart's format
          setGenreFreqs(() => {
            const freqs = Object.entries(freqCounter).map(([genre, freq]) => {
              if (!genre || !freq) {
                return null
              }

              return {
                name: genre,
                count: freq
              }
              // filter out bad data
            }).filter((datapoint) => {
              return datapoint !== null;
            })


            return freqs;
          })

          // get most freq item
          const mostFreqItem = Object.keys(freqCounter).reduce((max, item) => {
            return freqCounter[item] > freqCounter[max] ? item : max;
          })

          return mostFreqItem;
        })

        // set pop vs. listens chart data 
        setPopVsListens(() => {
          // put in recharts form and drop any null data
          const chartData = artistInfo.map((info) => {
            if (!info.playCount || !info.popularity) {
              return null;
            }

            return {
              playCount: parseInt(info.playCount),
              popularity: info.popularity
            }
          }).filter((data) => {
            return data !== null
          }).sort((a, b) => a.playCount - b.playCount);

          return (chartData)
        })
      } catch (err) {
        console.warn("Unable to fetch user artist data.", err)
        setDidFindArtistData(false)
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

  function resetEverything() {
    setArtists([])
    setDisplayedArtists([])
    setMostMainstream({})
    setMostNiche({})
    setTopGenre("")
    setSearchTerm("")
    setHiddenGenres([])
    setDidFindArtistData(true)
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

  const artistCards = displayedArtists?.map((info, index) => {
    return (
      <ArtistCard
        key={`${index}-${info.name}`}
        data={info}
        rank={index}
      />
    )
  })

  const mostMainstreamCard = (
    <StatCard
      data={mostMainstream}
      heading="Most mainstream"
    />
  )

  const mostNicheCard = (
    <StatCard
      data={mostNiche}
      heading="Most niche"
    />
  )

  const topGenreCard = (
    <div className="flex flex-col items-center mb-8">
      <p>Most listened to genre</p>
      <p className="text-2xl font-bold">{topGenre ? capitalize(topGenre) : "unknown"}</p>
    </div>
  )

  const popVsPlayChart = (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-lg font-bold">Popularity vs. Playcount</h2>
      <p className="text-gray-500">See listening patterns change based on artist popularity!</p>
      <LineChart
        width={500}
        height={300}
        data={popVsListens}
        margin={{
          top: 30,
          bottom: 30,
          right: 65
        }}
      >
        <CartesianGrid
          stroke="#ffffff"
          strokeOpacity="0.2"
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="playCount"
          label={{
            value: 'Play Count',
            position: 'insideBottom',
            offset: -15,
            style: {
              textAnchor: "middle"
            }
          }}
        />
        <YAxis
          label={{
            value: 'Popularity',
            angle: -90,
            position: "insideLeft",
            offset: 15,
            style: {
              textAnchor: "middle"
            }
          }} />
        <Line
          type="monotone"
          dataKey="popularity"
          stroke="#1DBE57"
          strokeWidth="3"
        />
      </LineChart>
    </div>
  );

  const genreFreqChart = (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-lg font-bold">Genres</h2>
      <p className="text-gray-500">What genres is this user most into?</p>
      <BarChart
        width={500}
        height={300}
        data={genreFreqs} // Your frequency data, e.g. [{ name: 'mexican rock', count: 3 }, ...]
        margin={{
          top: 30,
          bottom: 50,
          right: 65,
        }}
      >
        <CartesianGrid
          stroke="#ffffff"
          strokeOpacity="0.2"
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="name"
          label={{
            value: 'Genre',
            position: 'insideBottom',
            offset: -35,
            style: {
              textAnchor: "middle",
            },
          }}
          angle={-45} // Rotates the genre labels to avoid overlap
          tick={{
            dx: 0,
            dy: 0,
            fill: "#fff",
            opacity: 0.5
          }}
        />
        <YAxis
          label={{
            value: 'Frequency',
            angle: -90,
            position: "insideLeft",
            offset: 15,
            style: {
              textAnchor: "middle",
            }
          }}
        />
        <Bar
          dataKey="count"
          fill="#1DBE57" // You can adjust this color
          barSize={25} // Optional: adjust bar thickness
        />
      </BarChart>
    </div>
  )

  const charts = (
    <div className="flex flex-col">
      {popVsPlayChart}
      {genreFreqChart}
    </div>
  )

  const filters = (
    <div className="flex flex-col gap-2 max-w-50 m-4 mt-10">
      <input
        type="text"
        placeholder="Filter search..."
        onChange={onFilterSearch}
        className="w-full text-center text-white focus:outline-none border-0 p-1 bg-gray-900 rounded-2xl placeholder:text-gray-600"
      />
      <GenreFilter
        artists={artists}
        hiddenGenres={hiddenGenres}
        setHiddenGenres={setHiddenGenres}
      />
      <FollowerFilter setMinFollowers={setMinFollowers} setMaxFollowers={setMaxFollowers} />
    </div>
  )

  const artistInfoTable = (
    <div className="w-min flex flex-col items-center">
      <div className="flex flex-col items-center">
        <div className="flex justify-center">
          {mostMainstreamCard}
          {mostNicheCard}
        </div>
        {topGenreCard}
      </div>
      <div className="flex">
        {filters}
        <table className="h-min max-w-125 border-separate border-spacing-2">
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
        {charts}
      </div>
    </div>
  )

  return (
    <div className="flex justify-center text-white">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-extrabold m-4 flex gap-2 items-center">
          #MyTop12 <FaLastfmSquare />
        </h1>
        <p className="m-3 w-100 text-center text-gray-400">Enter someone's LastFM username to know what they've been listening to!</p>
        <input
          type="text"
          placeholder="rafaisafar"
          ref={(me) => inputRef.current = me}
          className="text-center text-black focus:outline-none border-0 m-4 p-2 bg-white rounded-full placeholder:text-gray-500 placeholder:font-normal"
        />
        {didFindArtistData ? (
          artists.length > 0 ? artistInfoTable : <Loader />
        ) : (
          <UserNotFoundPlaceholder />
        )}
      </div>
    </div>
  )
}

export default Dashboard;
