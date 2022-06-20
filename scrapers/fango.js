module.exports = () => {
  const lokation = 'Galerie Fango'
  const result = [
    ['2022-04-14', '20:00', 'Jam Session'],
    ['2022-04-30', '20:00', 'Concerto Fango: Lost But Grounde'],
    ['2022-06-02', '20:00', 'Concerto Fango: Three For Silver'],
    ['2022-09-09', '20:00', 'Concerto Fango: Mummys A Tree'],
    ['2022-09-30', '20:00', 'Concerto Fango: Jonas Ringtved']
  ]
  return result.map((arr) => {
    const [datum, zeit, info] = arr
    return { datum, zeit, lokation, info }
  })
}