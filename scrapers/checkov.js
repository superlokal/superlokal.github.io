module.exports = () => {
  const lokation = 'Chekov'
  const result = [
    ['2022-04-24', '10:00', 'Frühjahrsputz Chekov'],
    ['2022-05-21', '22:00', 'KYMATIK goes CHEKOV'],
    ['2022-06-03', '16:00', '... The unoptimal Festival !']
  ]
  return result.map((arr) => {
    const [datum, zeit, info] = arr
    return { datum, zeit, lokation, info }
  })
}