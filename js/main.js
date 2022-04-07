function pipe (...cbs) {
  const items = cbs[0];
  let result = items;
  if (items.length > 0) {
    for (let i = 1, n = cbs.length; i < n; i++) {
      result = result.filter(cbs[i]);
    }
  }
  return result
}

function createElement (tagName, attributes = {}) {
  const el = document.createElement(tagName)
  for (const [name, value] of Object.entries(attributes)) {
    const type = typeof value 
    if (type === 'string') el.setAttribute(name, value);
    if (type === 'function') el.addEventListener(name, value);
  }
  return el
}

(function() {
  const filters = [];
  const searchParams = (new URL(document.location)).searchParams;
  for (const [key, value] of searchParams) {
    filters.push((event) => {
      if (event[key]) return event[key].startsWith(value)
      // default:
      return true
    })
  }
  const eventsTable = document.getElementById('events')
  const eventsRows = [...eventsTable.querySelectorAll('tbody tr')]
  const filterForm = document.getElementById('filterForm')
  const filterList = document.getElementById('filterList')

  const addFilter = (params) => {
    for (const param of params) {
      const [ name, value ] = param.split('=')
      const hiddenInput = createElement('input', {
        type: 'hidden',
        name,
        value
      })
      filterForm.appendChild(hiddenInput)
    }
    filterForm.submit()
  }

  const allEvents = eventsRows.map((row, index) => {
    const [ datum, zeit, lokation, info ] = [...row.children].map((c) => c.innerText )
    return { datum, zeit, lokation, info, index }
  })

  const filteredEvents = pipe(allEvents, ...filters)
  eventsRows.forEach((row, index) => {
    const filtered = filteredEvents.find((e) => e.index === index);
    if (!filtered) row.classList.add('hidden');
  })

  // console.log(filteredEvents)
  if (filters.length === 0) {
    filterList.innerHTML = '<li>Keine Filter ausgewählt.</li>'
  }
  for (const [name, value] of searchParams) {
    const filterItem = createElement('li')
    filterItem.innerHTML = `${name} = ${value}`
    filterList.appendChild(filterItem)
  }

  const todayFilterInput = createElement('input', {
    type: 'button',
    name: 'datum',
    value: 'Heute',
    click: () => {
      const now = new Date()
      const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      addFilter([`datum=${today}`])
    }
  })

  filterForm.appendChild(todayFilterInput)
})()
