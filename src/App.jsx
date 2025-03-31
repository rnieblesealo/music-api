import { getTopArtists, getArtistImage } from "./scripts/music-search"
import { useState, useEffect, useRef } from "react"

const App = () => {
  const ArtistCard = ({ name, imgSrc }) => {
    return (
      <li className="flex flex-col items-center justify-top bg-black text-white text-center p-4 rounded-2xl">
        <img
          src={imgSrc}
          className="w-50 object-cover aspect-square rounded-lg"
        />
        <p className="mt-4 font-bold">{name}</p>
      </li>
    )
  }

  const [username, setUsername] = useState("rafaisafar")
  const [artists, setArtists] = useState([])

  useEffect(() => {
    async function getArtistInfo() {
      try {
        // get all the names
        const artistNames = await getTopArtists(username)

        // pack image, name kv pairs in array 
        const artistInfo = await Promise.all(
          artistNames.map(async (artistName) => {
            try {
              const artistImage = await getArtistImage(artistName)
              return {
                name: artistName,
                image: artistImage
              }
            } catch (err) {
              console.log(err)
            }
          })
        )

        setArtists(artistInfo)
      } catch (err) {
        console.log(err)
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

  const artistCards = artists.length > 0 ? artists.map(({ name, image }) => {
    return (
      <ArtistCard
        key={`a-${name}`}
        name={name}
        imgSrc={image}
      />
    )
  }) : (
    <div className="text-black">
      Searching...
    </div>
  )

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-extrabold m-4">#MyTop12</h1>
      <p>Enter someone's username to find out their top 12 on LastFM!</p>
      <input
        type="text"
        placeholder="rafaisafar"
        ref={(me) => inputRef.current = me}
        className="text-center focus:outline-none border-0 m-4 p-2 bg-gray-300 rounded-full"
      />
      <ul className="grid grid-cols-3 w-3/4 gap-3">
        {artistCards}
      </ul>
    </div>
  )
}

export default App
