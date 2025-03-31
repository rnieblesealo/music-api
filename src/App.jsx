import { getTopArtists, getArtistImage } from "./scripts/music-search"
import { useState, useEffect, useRef } from "react"
import { FaLastfm, FaPlay } from "react-icons/fa6";
import { FaLastfmSquare } from "react-icons/fa";

const App = () => {
  const ArtistCard = ({ name, imgSrc, playCount, rank }) => {
    return (
      <li className="flex flex-col items-center justify-top bg-black text-center p-4 rounded-2xl">
        <img
          src={imgSrc}
          className="w-50 object-cover aspect-square rounded-lg"
        />
        <div className="text-white flex flex-col items-center">
          <p className="mt-4 flex items-center gap-1 w-min text-gray-600">{`#${rank}`}</p>
          <p className="mt-2 font-bold">{`#${name}`}</p>
          <p className="mt-2 flex items-center gap-1 w-min">
            <FaPlay />
            {playCount}
          </p>
        </div>
      </li>
    )
  }

  const [username, setUsername] = useState("rafaisafar")
  const [artists, setArtists] = useState([])

  useEffect(() => {
    async function getArtistInfo() {
      try {
        // get all the names
        const lastFmData = await getTopArtists(username)

        // pack image, name kv pairs in array 
        const artistInfo = await Promise.all(
          lastFmData.map(async (artistData) => {
            try {
              const artistImage = await getArtistImage(artistData.name)

              const finalData = {
                ...artistData,
                image: artistImage
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

  const artistCards = artists.length > 0 ? artists.map((info, index) => {
    console.log(info)

    return (
      <ArtistCard
        key={`a-${info.name}`}
        rank={index + 1}
        name={info.name}
        playCount={info.playCount}
        imgSrc={info.image}
      />
    )
  }) : (
    <div className="text-black">
      Searching...
    </div>
  )

  return (
    <div className="flex flex-col items-center text-white p-12 bg-gradient-to-b from-black to-red-500 min-h-[1000px]">
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
      <p className="flex items-center gap-2 m-3 text-gray-500">Powered by <FaLastfmSquare /></p>
      <ul className="grid grid-cols-3 gap-3">
        {artistCards}
      </ul>
    </div>
  )
}

export default App
