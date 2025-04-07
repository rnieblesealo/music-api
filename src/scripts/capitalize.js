function capitalize(s) {
  const toks = s.trim().split(" ")
  return toks.map((tok) => {
    return tok[0].toUpperCase() + tok.slice(1)
  }).join(" ")
}

export default capitalize;
