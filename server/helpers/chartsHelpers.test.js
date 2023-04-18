import * as chartHelpers from './chartsHelpers'
import { createTableHeaders, createGraphTableRows } from '../../test/fixtures'

describe('helpers - chartHelpers', () => {
  describe(chartHelpers.formatGraphTableDataToCSV, () => {
    it('formats graph table data to csv table data', () => {
      expect(
        chartHelpers.formatGraphTableDataToCSV({
          tableColumns: createTableHeaders(),
          tableRows: createGraphTableRows(),
        })
      ).toEqual({
        tableColumns: [
          'Site',
          'Pending evaluation',
          'Excellent',
          'Good',
          'Average',
          'Poor',
          'Total',
        ],
        tableRows: [
          [
            'Totals',
            '60 / 215 (28%)',
            '87 / 215 (40%)',
            '40 / 215 (19%)',
            '26 / 215 (12%)',
            '2 / 215 (1%)',
            '215',
          ],
          ['Birmingham', '2', '0', '0', '0', '0', '2'],
          ['Calgary', '3', '2', '0', '1', '0', '6'],
          ['Cambridge UK', '1', '0', '1', '0', '0', '2'],
        ],
      })
    })
  })
})
