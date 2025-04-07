import { getTopArtists, getSpotifyArtistInfo } from "./scripts/music-search"
import { useState, useEffect, useRef } from "react"

const App = () => {
  function capitalize(s) {
    const toks = s.trim().split(" ")
    return toks.map((tok) => {
      return tok[0].toUpperCase() + tok.slice(1)
    }).join(" ")
  }

  const ArtistCard = ({ data, rank }) => {
    const Unk = () => (
      <p className="text-gray-600">unknown</p>
    )

    return (
      <tr className="align-middle text-center">
        <td className="text-xl font-bold flex items-center">
          <img
            src={data.image}
            className="w-30 rounded-2xl object-cover aspect-square"
          />
          <p className="mx-4">{`#${rank + 1} ${data.name}`}</p>
        </td>
        <td>{(data && data.playCount) ?? <Unk />}</td>
        <td>{(data && data.genres && data.genres.length > 0) ? capitalize(data.genres[0]) : <Unk />}</td>
        <td>{(data && data.followers) ?? <Unk />}</td>
        <td>{(data && data.popularity) ?? <Unk />}</td>
      </tr>
    )
  }

  const StatCard = ({ data, heading }) => {
    return (
      <div className="p-4 rounded-2xl flex flex-col items-center">
        <p className="text-center my-2">{heading}</p>
        <img
          src={data.image}
          className="w-40 aspect-square object-cover rounded-lg"
        />
        <p className="text-center font-bold text-lg my-3">{data.name}</p>
      </div>
    )
  }

  const [username, setUsername] = useState("rafaisafar")
  const [artists, setArtists] = useState([])
  const [mostMainstream, setMostMainstream] = useState(null)
  const [mostNiche, setMostNiche] = useState(null)
  const [mainGenre, setMainGenre] = useState(null)

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

        setMainGenre(() => {
          // get top match genre for each artist
          const mainGenres = artistInfo.map((info) => {
            return (info.genres && info.genres.length > 0) ? info.genres[0] : ""
          }).filter((item) => {
            return item !== ""
          })

          // basic dict freq counting
          const freqCounter = mainGenres.reduce((counter, item) => {
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

  const inputRef = useRef(null)

  useEffect(() => {
    // submit search on enter press
    // not on change to avoid api call abuse

    function handleSearchSubmit(e) {
      if (e.key === "Enter") {
        setArtists([])
        setUsername(e.target.value)
      }
    }

    const searchBar = inputRef.current
    if (searchBar) {
      searchBar.addEventListener("keydown", handleSearchSubmit)
    }
  }, [])

  const artistCards = artists.map((info, index) => {
    return (
      <ArtistCard
        key={`${index}-${info.name}`}
        data={info}
        rank={index}
      />
    )
  })

  const mostMainstreamComp = mostMainstream && (
    <StatCard
      data={mostMainstream}
      heading="Most mainstream"
    />
  )

  const mostNicheComp = mostNiche && (
    <StatCard
      data={mostNiche}
      heading="Most niche"
    />
  )

  const mainGenreComp = mainGenre && (
    <div className="flex flex-col items-center mb-8">
      <p>Most listened to genre</p>
      <p className="text-2xl font-bold">{mainGenre ? capitalize(mainGenre) : "unknown"}</p>
    </div>
  )

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
      <div className="">
        <div className="flex">
          {mostMainstreamComp}
          {mostNicheComp}
        </div>
        {mainGenreComp}
      </div>
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
    </div>
  )
}

export default App
