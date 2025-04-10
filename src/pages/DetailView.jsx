import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { getSpotifyArtistInfoById } from "../scripts/music-search"

import CircularProgress from "../components/CircularProgress"
import UnknownFiller from "../components/UnknownFiller"
import Loader from "../components/Loader"
import capitalize from "../scripts/capitalize"

import { IoPersonSharp } from "react-icons/io5";

const DetailView = () => {
  let params = useParams()

  const [didLoadData, setDidLoadData] = useState(false)
  const [name, setName] = useState("")
  const [image, setImage] = useState("")
  const [genres, setGenres] = useState([])
  const [followers, setFollowers] = useState(-1)
  const [popularity, setPopularity] = useState(-1)

  useEffect(() => {
    async function setArtistInfo() {
      try {
        const info = await getSpotifyArtistInfoById(params.id)

        setName(info.name)
        setImage(info.image)
        setFollowers(info.followers)
        setGenres(info.genres)
        setPopularity(info.popularity)
      } catch (error) {
        console.error(error)
      }
    }

    setArtistInfo()
  }, [params.id])

  useEffect(() => {
    // ensure all data is loaded and ok
    setDidLoadData(
      name &&
      image &&
      genres &&
      (!isNaN(followers) && followers >= 0) &&
      (!isNaN(popularity) && popularity >= 0))
  }, [followers, genres, image, name, popularity])

  const heroImg = image ? (
    <img
      src={image}
      className="w-80 aspect-square object-cover pixelated rounded-2xl mb-10"
    />
  ) : (
    <div className="relative bg-gray-700 w-full h-80 aspect-square flex items-center justify-center">
      <IoPersonSharp className="text-gray-900 text-6xl" />
      <h1 className="absolute text-4xl font-bold">{name}</h1>
    </div>
  )

  const genreItems = genres.length > 0 ? genres.map((genre, index) => {
    return (
      <p key={`${index}-${genre}`}>{capitalize(genre)}</p>
    )
  }) : <UnknownFiller />

  const stats = (
    <div className="grid grid-cols-3 w-150 m-10">
      <p className="font-light text-sm mb-2 text-gray-500 text-center">FOLLOWERS</p>
      <p className="font-light text-sm mb-2 text-gray-500 text-center">GENRES</p>
      <p className="font-light text-sm mb-4 text-gray-500 text-center">POPULARITY</p>
      <div className="flex flex-col justify-center text-center">
        <h2 className="text-4xl font-bold">{followers >= 0 ? followers.toLocaleString() : <UnknownFiller />}</h2>
      </div>
      <div className="flex flex-col items-center justify-center">
        <ul className="flex flex-col justify-center items-center text-center text-2xl">
          {genreItems}
        </ul>
      </div>
      <div className="flex flex-col items-center justify-center">
        <CircularProgress value={popularity >= 0 ? popularity : <UnknownFiller />} max={100} />
      </div>
    </div>
  )

  const content = (
    <>
      {heroImg}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold">{name}</h1>
        {stats}
      </div>
    </>
  )

  return (
    <div className="text-white flex flex-col items-center">
      {didLoadData ? content : <Loader />}
    </div>
  )
}

export default DetailView;
