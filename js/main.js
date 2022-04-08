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
  const params = {
    datum: []
  }
  for (const [key, value] of searchParams) {
    if (params[key]) params[key].push(value)
  }
  for (const [key, arr] of Object.entries(params)) {
    filters.push((event) => {
      if (event[key]) {
        // multiple filters as AND:
        return arr.some((value) => {
          return event[key].startsWith(value)
        })
      }
      // default:
      return true
    })
  }
  const eventsTable = document.getElementById('events')
  const eventsRows = [...eventsTable.querySelectorAll('tbody tr')]
  const filterForm = document.getElementById('filterForm')
  const filterList = document.getElementById('filterList')

  const addFilters = (params) => {
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

  const createFilterButton = (buttonName, paramName, fn) => {
    const button = createElement('input', {
      type: 'button',
      name: paramName,
      value: buttonName,
      click: fn
    })
    return button
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

  if (filters.length === 0) {
    filterList.innerHTML = '<li>Keine Filter ausgewählt.</li>'
  } else {
    document.getElementById('resetFilters').innerHTML = '<a href="/">Alle Filter zurücksetzen</a>'
  }
  for (const [name, value] of searchParams) {
    const filterItem = createElement('li')
    filterItem.innerHTML = `<a href="/?${name}=${value}">${name}=${value}</a>`
    filterList.appendChild(filterItem)
  }

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const todayFilterButton = createFilterButton('Heute', 'datum', () => {
    addFilters([`datum=${formatDate(new Date())}`])
  })

  const tomorrowFilterButton = createFilterButton('Morgen', 'datum', () => {
    const now = new Date()
    const t = new Date(now.setDate(now.getDate() + 1));
    const tomorrow = formatDate(t)
    addFilters([`datum=${tomorrow}`])
  })

  const now = new Date()
  const currentMonthName = now.toLocaleString('de-de', { month: "long" })
  const currentYear = now.getFullYear()
  const currentMonth = String(now.getMonth()+1).padStart(2, '0')
  const nextMonthDate = new Date(currentYear, now.getMonth()+1, 1)
  const nextMonth = String(nextMonthDate.getMonth()+1).padStart(2, '0')
  const nextMonthName = nextMonthDate.toLocaleString('de-de', { month: "long" })
  
  const currentMonthFilterButton = createFilterButton(currentMonthName, 'datum', () => {
    addFilters([`datum=${currentYear}-${currentMonth}`])
  })
  const nextMonthFilterButton = createFilterButton(nextMonthName, 'datum', () => {
    addFilters([`datum=${currentYear}-${nextMonth}`])
  })

  const filterButtons = [
    todayFilterButton,
    tomorrowFilterButton,
    currentMonthFilterButton,
    nextMonthFilterButton
  ]

  for (const button of filterButtons) {
    filterForm.appendChild(button)
  }
  
})()
