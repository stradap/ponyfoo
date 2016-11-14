'use strict'

const moment = require(`moment`)
const dateInputFormat = `DD-MM-YYYY`
const rduration = /^\+?[0-9]+$/
const formats = {
  precise: {
    title: `hh:mm:ss A, MMM D, YYYY ([GMT] Z)`,
    text: `hh:mm:ss A, MMM D`
  },
  default: {
    title: `hh:mm A, MMM D, YYYY ([GMT] Z)`,
    text: `MMMM D, YYYY`
  }
}

function field (value, format) {
  const ff = format || `default`
  const f = formats[ff]
  const m = moment.utc(value)
  if (m.isValid()) {
    return {
      text: m.format(f.text),
      title: prettifyTimezone(m.format(f.title)),
      datetime: m.toISOString()
    }
  }
  return null
}

function range (left, right) {
  const start = moment.utc(left)
  const end = moment.utc(right)
  const singleMonth = start.month() === end.month()
  const singleDate = singleMonth && start.date() === end.date()
  return {
    year: end.format(`YYYY`),
    dates: getDates(),
    title: getTitle()
  }
  function getDates () {
    if (singleDate) {
      return [[start.format(`Do`), start.format(`MMMM`)]]
    }
    if (singleMonth) {
      return [[start.format(`D`)], [end.format(`D`), end.format(`MMMM`)]]
    }
    return [[start.format(`D`), start.format(`MMM`)], [end.format(`D`), end.format(`MMM`)]]
  }
  function getTitle () {
    if (singleDate) {
      return start.format(`Do MMMM, YYYY`)
    }
    if (singleMonth) {
      return start.format(`D`) + `—` + end.format(`D MMMM, YYYY`)
    }
    return start.format(`D MMM`) + ` — ` + end.format(`D MMM, YYYY`)
  }
}

function prettifyTimezone (text) { // turns -03:00 into -3, +00:00 into nothingness
  return text.replace(/([+-])0+/, `$1`).replace(`:00)`, `)`).replace(/ [+-]\)$/, `)`)
}

function parseDate (value) {
  const parts = value.split(`-`)
  if (parts.length === 2) { // allow to skip over the year, e.g '18-10'
    parts.push(moment.utc().year())
  } else if (parts.length !== 3) {
    return null
  }
  if (parts[0].length === 1) { // allow dates like '1-06-2014'
    parts[0] = `0` + parts[0]
  }
  if (parts[1].length === 1) { // allow dates like '01-6-2014'
    parts[1] = `0` + parts[1]
  }
  const m = moment.utc(parts.join(`-`), dateInputFormat, true)
  return m.isValid() ? m.toDate() : null
}

function parseDuration (value) {
  if (rduration.test(value) === false) {
    return null // input such as '20feet' is strictly invalid
  }
  const d = parseInt(value, 10)
  return d > 0 ? d : null
}

module.exports = {
  range: range,
  field: field,
  parseDate: parseDate,
  parseDuration: parseDuration
}
