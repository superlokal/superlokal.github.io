module.exports = () => {
  const lokation = 'Galerie Fango'
  const result = [
    //['2022-04-14', '20:00', 'Jam Session'],
  ]
  return result.map((arr) => {
    const [datum, zeit, info] = arr
    return { datum, zeit, lokation, info }
  })
}
