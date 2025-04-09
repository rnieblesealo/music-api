import capitalize from '../scripts/capitalize'

import { FaQuestion } from "react-icons/fa";

const ArtistCard = ({ data, rank }) => {
  const UnknownFiller = () => (
    <p className="text-gray-600 flex items-center justify-center"><FaQuestion/></p>
  )

  return (
    <tr className="align-middle text-center">
      <td className="text-xl font-bold flex items-center">
        <img
          src={data.image}
          className="w-30 rounded-2xl object-cover aspect-square"
        />
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
