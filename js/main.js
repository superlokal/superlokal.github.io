(function() {
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

  const filters = [];
  const searchParams = {
    // Use Map for unique entries:
    datum: new Map(),
    zeit: new Map(),
    lokation: new Map(),
    info: new Map()
  }
  for (const [key, value] of (new URL(document.location)).searchParams) {
    if (searchParams[key]) searchParams[key].set(value, true)
  }
  for (const [key, map] of Object.entries(searchParams)) {
    if (map.size > 0) {
      filters.push((event) => {
        if (event[key]) {
          // multiple filters as AND:
          return Array.from(map.keys()).some((value) => {
            return event[key].startsWith(value)
          })
        }
        // default:
        return true
      })
    }
  }
  const eventsTable = document.getElementById('events')
  const eventsRows = [...eventsTable.querySelectorAll('tbody tr')]
  const filterForm = document.getElementById('filterForm')
  const filterDatum = document.getElementById('filterDatum')
  const filterLokation = document.getElementById('filterLokation')
  const filterList = document.getElementById('filterList')

  const addHiddenInput = (name, value) => {
    const oldElement = filterForm.querySelector(`input[type=hidden][name=${name}]`)
    const hiddenInput = createElement('input', {
      type: 'hidden',
      name,
      value
    })
    if (oldElement) {
      filterForm.replaceChild(hiddenInput, oldElement)
    } else {
      filterForm.appendChild(hiddenInput)
    }
  }

  const addFilters = (params) => {
    for (const param of params) {
      const [ name, value ] = param.split('=')
      addHiddenInput(name, value)
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

  let allLocations = new Map()

  const filteredEvents = pipe(allEvents, ...filters)
  eventsRows.forEach((row, index) => {
    const filtered = filteredEvents.find((e) => e.index === index);
    if (!filtered) row.classList.add('hidden');
    const lokation = row.children[2].textContent.trim()
    const count = allLocations.get(lokation) || 0
    allLocations.set(lokation, count + 1)
  })

  allLocations = new Map([...allLocations.entries()].sort())

  if (filters.length === 0) {
    filterList.innerHTML = '<li>Kein Filter ausgewählt.</li>'
  } else {
    document.getElementById('resetFilters').innerHTML = '<a href="/">Alle Filter zurücksetzen</a>'
  }
  for (const [name, map] of Object.entries(searchParams)) {
    let keyIndex = 1
    for (const value of map.keys()) {
      if (value && value !== '') {
        const filterItem = createElement('li')
        filterItem.innerHTML = `<a href="/?${name}=${value}">${name}=${value}</a>`
        if (name === 'datum') {
          if (keyIndex === map.size) {
            addHiddenInput(name, value)
            filterList.appendChild(filterItem)
          }
        } else {
          filterList.appendChild(filterItem)
        }
      }
      keyIndex = keyIndex + 1
    }
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

  const filterDatumButtons = [
    todayFilterButton,
    tomorrowFilterButton,
    currentMonthFilterButton,
    nextMonthFilterButton
  ]

  for (const button of filterDatumButtons) {
    filterDatum.appendChild(button)
  }

  const lokationSelect = createElement('select', {
    name: 'lokation',
    multiple: true,
    change: () => filterForm.submit()
  })
  const noOption = createElement('option', {
    value: ''
  })
  noOption.innerText = 'Filter für Lokation auswählen'
  lokationSelect.appendChild(noOption)
  for (const [lokation, _count] of allLocations) {
    const selected = Array.from(searchParams['lokation'].keys()).includes(lokation) || false
    let option = createElement('option', {
      value: lokation
    })
    option.selected = selected;
    option.innerText = lokation;
    lokationSelect.appendChild(option);
  }

  filterLokation.appendChild(lokationSelect)
  
})()
