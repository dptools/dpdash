import BarChartTableService from '.'
import { createLabel, createSiteData } from '../../../test/fixtures'
import { NETWORK, TOTAL_LABEL } from '../../constants'

const dataBySite = [
  createSiteData({
    name: 'Site 1',
    counts: {
      Good: 1,
      Bad: 2,
      Total: 3,
    },
    totalsForStudy: {
      count: 3,
    },
    percentages: {
      Good: 33.33,
      Bad: 66.66,
    },
    targets: {
      Good: 0,
      Bad: 0,
    },
  }),
  createSiteData({
    name: 'Site 2',
    counts: {
      Good: 4,
      Bad: 6,
      Total: 10,
    },
    totalsForStudy: {
      count: 10,
    },
    percentages: {
      Good: 40,
      Bad: 60,
    },
    targets: {
      Good: 4,
      Bad: 6,
    },
  }),
]
const labels = [
  createLabel({ name: 'Good', color: 'good-color' }),
  createLabel({ name: 'Bad', color: 'bad-color' }),
]

describe(BarChartTableService, () => {
  describe('.websiteTableData', () => {
    it('returns columns and rows', () => {
      const service = new BarChartTableService(dataBySite, labels)

      expect(service.websiteTableData()).toEqual({
        tableColumns: [
          {
            dataProperty: 'site',
            label: NETWORK,
            sortable: true,
          },
          {
            dataProperty: 'Good',
            label: 'Good',
            sortable: false,
          },
          {
            dataProperty: 'Bad',
            label: 'Bad',
            sortable: false,
          },
          {
            dataProperty: 'Total',
            label: 'Total',
            sortable: false,
          },
        ],
        tableRows: [
          { Bad: '2', Good: '1', Total: '3', site: 'Site 1' },
          {
            Bad: '6 / 6 (100%)',
            Good: '4 / 4 (100%)',
            Total: '10',
            site: 'Site 2',
          },
        ],
      })
    })
  })

  describe('.csvTableData', () => {
    it('returns columns and rows', () => {
      const service = new BarChartTableService(dataBySite, labels)

      // website table data needs to be run first to build the data needed for csv
      service.websiteTableData()

      expect(service.csvTableData()).toEqual({
        tableColumns: [NETWORK, 'Good', 'Bad', TOTAL_LABEL],
        tableRows: [
          ['Site 1', '1', '2', '3'],
          ['Site 2', '4 / 4 (100%)', '6 / 6 (100%)', '10'],
        ],
      })
    })
  })
})
