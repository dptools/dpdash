const stringToDate = (_date, _format, _delimiter) => {
  const formatLowerCase = _format.toLowerCase()
  const formatItems = formatLowerCase.split(_delimiter)
  const dateItems = _date.split(_delimiter)
  const monthIndex = formatItems.indexOf('mm')
  const dayIndex = formatItems.indexOf('dd')
  const yearIndex = formatItems.indexOf('yyyy')
  let month = parseInt(dateItems[monthIndex], 10)
  const year =
    dateItems[yearIndex].length === 2
      ? '20' + dateItems[yearIndex]
      : dateItems[yearIndex]
  return new Date(year, --month, dateItems[dayIndex])
}
const diffDates = (date1, date2) => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  return Math.round((date2 - date1) / millisecondsPerDay)
}

export { diffDates, stringToDate }
