import { getTopArtists, getArtistImage } from "./scripts/music-search"
import { useState, useEffect } from "react"

const App = () => {
  const username = "rafaisafar"
  const [topArtists, setTopArtists] = useState([])

  useEffect(() => {
  }, [])

  return (
    <div>
      <h1>Top Artists</h1>
    </div>
  )
}

export default App
