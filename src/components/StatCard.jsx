const StatCard = ({ data, heading }) => {
  return (
    <div className="p-4 rounded-2xl flex flex-col items-center">
      <p className="text-center my-2">{heading}</p>
      <img
        src={data.image}
        className="w-40 aspect-square object-cover rounded-lg"
      />
      <p className="text-center font-bold text-lg my-3">{data.name}</p>
    </div>
  )
}

export default StatCard;
