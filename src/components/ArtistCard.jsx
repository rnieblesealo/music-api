import capitalize from '../scripts/capitalize'

import { Link, useNavigate } from "react-router-dom"

import { FaQuestion } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";

const ArtistCard = ({ data, rank }) => {
  const UnknownFiller = () => (
    <p className="text-gray-600 flex items-center justify-center"><FaQuestion /></p>
  )

  // do img placeholder if failed to find
  const img = data.image ? (
    <img
      src={data.image}
      className="min-w-30 w-30 rounded-2xl object-cover aspect-square"
    />
  ) : (
    <div className="min-w-30 w-30 rounded-2xl aspect-square bg-gray-900 flex items-center justify-center text-gray-600 text-3xl">
      <IoPersonSharp />
    </div>
  )

  const navigate = useNavigate()

  return (
    <tr 
      onClick={() => {navigate(`/artistInfo/${data.id}`)}}
      className="align-middle text-center">
      <td className="text-xl font-bold flex items-center">
        {img}
        <p className="mx-4 text-left">
          <span className="text-gray-500 mx-1">
            {`#${rank + 1}`}
          </span>
          {`${data.name}`}
        </p>
      </td>
      <td>{data?.playCount ?? <UnknownFiller />}</td>
      <td>{data?.genres?.[0] ? capitalize(data.genres[0]) : <UnknownFiller />}</td>
      <td>{data?.followers ? data.followers.toLocaleString() : <UnknownFiller />}</td>
    </tr>
  )
}

export default ArtistCard;
