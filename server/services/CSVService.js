import { stringify } from 'csv-stringify'

class CsvService {
  constructor(csvData) {
    const { tableColumns, tableRows } = csvData

    if (!tableColumns || !tableRows) {
      throw new Error(
        'CSV data must have tableColumns and tableRows attributes'
      )
    }

    this.columns = tableColumns
    this.rows = tableRows
  }

  toReadableStream = () => {
    return stringify(this.rows, {
      header: true,
      columns: this.columns,
    })
  }
}

export default CsvService
