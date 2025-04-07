import { getTopArtists, getSpotifyArtistInfo } from "./scripts/music-search"
import { useState, useEffect, useRef } from "react"
import { FaLastfm, FaPlay } from "react-icons/fa6";
import { FaLastfmSquare } from "react-icons/fa";

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

  const [username, setUsername] = useState("rafaisafar")
  const [artists, setArtists] = useState([])

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
        className="text-center text-black focus:outline-none border-0 m-4 mb-8 p-2 bg-white rounded-full placeholder:text-gray-500"
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
    </div>
  )
}

export default App
