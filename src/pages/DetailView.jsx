import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { getSpotifyArtistInfoById } from "../scripts/music-search"

const DetailView = () => {
  let params = useParams()

  useEffect(() => {
    async function getArtistInfo() {
      await getSpotifyArtistInfoById(params.id)
    }

    getArtistInfo()
  })

  return (
    <div className="text-white">
      {params.id}
    </div>
  )
}

export default DetailView;
