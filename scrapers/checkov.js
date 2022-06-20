module.exports = () => {
  const lokation = 'Chekov'
  const result = [
    ['2022-04-24', '10:00', 'Frühjahrsputz Chekov'],
    ['2022-05-21', '22:00', 'KYMATIK goes CHEKOV'],
    ['2022-06-03', '16:00', '... The unoptimal Festival !'],
    ['2022-06-23', '18:00', 'Fyahamnd | Vortrag'],
    ['2022-06-30', '18:00', 'Fyahamnd | Punk aus der Dose'],
    ['2022-07-07', '18:00', 'Fyahamnd | Liedermacher'],
    ['2022-07-14', '18:00', 'Fyahamnd | Nysmus und Hain’ze'],
    ['2022-07-30', '20:00', 'Los Fastidios + The Twinkles + Die fickenden Turnschuhe'],
    ['2022-09-29', '20:00', 'HECKSPOILER "Tokyo Drift" Cottbus'],
  ]
  return result.map((arr) => {
    const [datum, zeit, info] = arr
    return { datum, zeit, lokation, info }
  })
}