module.exports = async ({ JSDOM, axios }) => {
  const result = []
  // fetch next 12 weeks:
  for (let i=0; i <= 12; i++) {
    const response = await axios.get(`https://www.cottbus.de/erleben/veranstaltungen/week.pl?offset=${i}`)
    const { document } = (new JSDOM(response.data)).window
    const page = document.querySelector('#cbf_main')
    const children = [...page.children]
    let datum
    for (const child of children) {
      const classList = [...child.classList]
      if (classList.includes('cbf_reg_long')) {
        datum = child.textContent.trim().split(',')[1].trim().split('.').reverse().join('-')
      }
      if (classList.includes('cbfc-objects')) {
        const events = [...child.children]
        for (const event of events) {
          const zeit = event.querySelector('.e_incon .e_indent').textContent.replace('Uhr', '').trim()
          if (Number.isInteger(Number(zeit[0]))) {
            const info = event.querySelector('.e_title').textContent.trim()
            const lokation = event.querySelector('.e_incon .e_context').textContent.trim()
            result.push({
              datum,
              zeit,
              lokation,
              info
            })
          }
        }
      }
    }
  }
  return result
}
