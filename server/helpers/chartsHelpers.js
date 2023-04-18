export const legend = (fieldLabelValueMap) =>
  fieldLabelValueMap.map(({ label, color }) => ({
    name: label,
    symbol: {
      type: 'square',
      fill: color,
    },
  }))

export const formatGraphTableDataToCSV = ({ tableColumns, tableRows }) => {
  return {
    tableColumns: tableColumns.map(({ name }) => name),
    tableRows: tableRows.map((siteData) => siteData.map(({ data }) => data)),
  }
}
