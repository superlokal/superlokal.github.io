const jsdom = require("jsdom")
const { JSDOM } = jsdom
const axios = require('axios').default;
const fs = require('fs')

const template = fs.readFileSync('./index_template.html').toString();

const scrapers = {
  cottbus_stadt: require('./cottbus_stadt.js'),
  fango: require('./fango.js')
}

async function main () {
  let events = []
  for (const [_, fn ] of Object.entries(scrapers)) {
    events = events.concat(await fn({ JSDOM, axios }))
  }
  events.sort((a, b) => {
    return String(a.datum+a.zeit).localeCompare(b.datum + b.zeit)
  })
  const rows = events.map((event) => {
    return `<tr><td>${event.datum}</td><td>${event.zeit}</td><td>${event.lokation}</td><td>${event.info}</td></tr>`
  })
  const table = `<table id="events">
    <thead><tr><th>datum</th><th>zeit</th><th>lokation</th><th>info</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
  </table>`
  const output = template.replace('<table id="events"/>', table)
  fs.writeFileSync('./index.html', output)
}

main().catch(console.error)