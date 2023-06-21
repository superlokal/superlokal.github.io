module.exports = () => {
  const lokation = 'Chekov'
  const result = [
    //['2022-04-24', '10:00', 'Frühjahrsputz Chekov'],
  ]
  return result.map((arr) => {
    const [datum, zeit, info] = arr
    return { datum, zeit, lokation, info }
  })
}
