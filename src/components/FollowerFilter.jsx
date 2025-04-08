const FollowerFilter = ({ setMinFollowers, setMaxFollowers }) => {
  function updateMinFollowers(e) {
    if (e.target.value === "") {
      setMinFollowers(null)
    } else {
      const val = parseInt(e.target.value)
      if (!isNaN(val)) {
        setMinFollowers(val)
      }
    }
  }

  function updateMaxFollowers(e) {
    if (e.target.value === "") {
      setMinFollowers(null)
    } else {
      const val = parseInt(e.target.value)
      if (!isNaN(val)) {
        setMinFollowers(val)
      }
    }
  }

  return (
    <div className="fixed right-0 bottom-0 w-50 h-min bg-gray-900 rounded-2xl p-2">
      <p className="text-center my-2">Filter by follower count</p>
      <div className="flex flex-col gap-1 ml-4 mr-4 mb-4">
        <div className="flex">
          <label htmlFor="min" className="w-15 flex items-center justify-center">Min.</label>
          <input type="text" className="w-full bg-gray-800 rounded-lg focus:outline-none p-1 pl-3" onChange={updateMinFollowers} />
        </div>
        <div className="flex">
          <label htmlFor="min" className="w-15 flex items-center justify-center">Max.</label>
          <input type="text" className="w-full bg-gray-800 rounded-lg focus:outline-none p-1 pl-3" onChange={updateMaxFollowers} />
        </div>
      </div>
    </div>
  )
}

export default FollowerFilter;
