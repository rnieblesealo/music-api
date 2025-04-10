import clsx from "clsx"
import capitalize from "../scripts/capitalize"

const GenreFilter = ({
  artists,
  hiddenGenres,
  setHiddenGenres,
}) => {
  function toggleGenreHidden(genre) {
    // if given genre not hidden, hide it
    if (!hiddenGenres.includes(genre)) {
      setHiddenGenres((prev) => [...prev, genre])
      // if it is hidden, unhide it
    } else {
      setHiddenGenres((prev) => {
        // remove passed genre from list...
        return prev.filter((item) => item !== genre)
      })
    }
  }

  const GenreFilterButton = ({ genre }) => {
    const bgColor = clsx(
      hiddenGenres.includes(genre) ? "bg-red-700" : "bg-green-700"
    )

    return (
      <button
        onClick={() => toggleGenreHidden(genre)}
        className={`${bgColor} bg-green-700 rounded-lg`}>
        <p className="p-3 w-full font-bold">{capitalize(genre)}</p>
      </button>
    )
  }

  // get unique genres
  const uniqueGenres = artists.map((artist) => {
    if (artist.genres && artist.genres.length > 0) {
      return artist.genres[0]
    }

    return null;
  }).reduce((arr, curr) => {
    if (curr !== null && !arr.includes(curr)) {
      arr.push(curr)
    }

    return arr;
  }, [])

  // add genre filters
  const genreFilters = uniqueGenres.map((genre, index) => {
    return (
      <GenreFilterButton key={`${genre}-${index}`} genre={genre} />
    )
  })

  return (
    <div className="min-w-50 w-50 h-min bg-gray-900 rounded-2xl p-2">
      <p className="text-center mb-2 text-gray-600">Click a genre to hide it</p>
      <div className="flex flex-col w-full gap-2">
        {genreFilters} 
      </div>
    </div>
  )
}

export default GenreFilter;
