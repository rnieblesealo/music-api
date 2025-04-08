import capitalize from '../scripts/capitalize'

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
        <p className="mx-4">
          <span className="text-gray-500 mx-2">
            {`#${rank + 1}`}
          </span>
          {`${data.name}`}
        </p>
      </td>
      <td>{(data && data.playCount) ?? <Unk />}</td>
      <td>{(data && data.genres && data.genres.length > 0) ? capitalize(data.genres[0]) : <Unk />}</td>
      <td>{(data && data.followers && data.followers.toLocaleString()) ?? <Unk />}</td>
    </tr>
  )
}

export default ArtistCard;
