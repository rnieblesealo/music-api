import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { getSpotifyArtistInfoById } from "../scripts/music-search"

import { FaQuestion } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";

const DetailView = () => {
  let params = useParams()

  useEffect(() => {
    async function getArtistInfo() {
      await getSpotifyArtistInfoById(params.id)
    }

    // getArtistInfo()
  })

  const CircularProgress = ({ value, max }) => {
    const radius = 60;
    const stroke = 15;
    const normalizedRadius = radius - stroke / 2; // radius as 0-1 val
    const circumference = 2 * Math.PI * normalizedRadius;
    const percent = Math.min(Math.max(value / max, 0), 1); // percent as 0-1 val
    const strokeDashoffset = circumference * (1 - percent); // fill amt based on percent value

    // Color transition: from red (0%) to green (100%)
    const interpolateColor = (percent) => {
      const r = Math.round(255 * (1 - percent)); // how much is red
      const g = Math.round(255 * percent); // how much is green
      return `rgb(${r}, ${g}, 0)`; // put in full rgb component
    };

    return (
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#374151"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={interpolateColor(percent)}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="square"
          strokeDasharray={circumference + ' ' + circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`} // start at top
        />
        <text
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
          fontSize="25"
          fontWeight="bold"
          fill="#ffffff"
        >
          {Math.round(percent * 100)}
        </text>
      </svg>
    );
  };

  return (
    <div className="text-white">
      <div className="relative bg-gray-700 w-full h-40 aspect-square object-cover flex items-center justify-center">
        <IoPersonSharp className="text-gray-900 text-6xl" />
        <h1 className="absolute text-4xl font-bold">Artist Name</h1>
      </div>
      <div className="flex flex-col items-center justify-top m-4">
        <div className="flex flex-col justify-center text-center mb-8">
          <p className="font-light text-sm mb-2 text-gray-500">FOLLOWERS</p>
          <h2 className="text-4xl font-bold">100,000</h2>
        </div>
        <div className="flex flex-col items-center justify-center mb-10">
          <p className="font-light text-sm mb-2 text-gray-500">GENRES</p>
          <ul className="flex flex-col justify-center items-center text-center text-2xl">
            <p>Jazz</p>
            <p>Punk</p>
            <p>Ska</p>
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="font-light text-sm mb-4 text-gray-500">POPULARITY</p>
          <CircularProgress value={50} max={100} />
        </div>
      </div>
    </div>
  )
}

export default DetailView;
