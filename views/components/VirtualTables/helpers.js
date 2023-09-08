export const calculateRowCount = (contentList, searchResults) =>
  searchResults.length ? searchResults.length : contentList.length

export const rowClassName = ({ index }) => {
  if (index < 0) {
    return 'headerRow TableHeader'
  } else {
    const rowClass = 'TableRow'
    return index % 2 === 0 ? 'evenRow ' + rowClass : 'oddRow ' + rowClass
  }
}
