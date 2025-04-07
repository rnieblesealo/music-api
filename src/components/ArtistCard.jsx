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
        <p className="mx-4">{`#${rank + 1} ${data.name}`}</p>
      </td>
      <td>{(data && data.playCount) ?? <Unk />}</td>
      <td>{(data && data.genres && data.genres.length > 0) ? capitalize(data.genres[0]) : <Unk />}</td>
      <td>{(data && data.followers) ?? <Unk />}</td>
      <td>{(data && data.popularity) ?? <Unk />}</td>
    </tr>
  )
}

export default ArtistCard;
