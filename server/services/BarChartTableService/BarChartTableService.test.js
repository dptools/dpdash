import BarChartTableService from '.'
import { createLabel, createSiteData } from '../../../test/fixtures'
import { SITE, TOTAL_LABEL } from '../../constants'

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
          { name: SITE, color: 'gray' },
          ...labels,
          { name: TOTAL_LABEL, color: 'gray' },
        ],
        tableRows: [
          [
            { data: 'Site 1', color: 'gray' },
            { data: '1', color: 'good-color' },
            { data: '2', color: 'bad-color' },
            { data: '3', color: 'gray' },
          ],
          [
            { data: 'Site 2', color: 'gray' },
            { data: '4 / 4 (100%)', color: 'good-color' },
            { data: '6 / 6 (100%)', color: 'bad-color' },
            { data: '10', color: 'gray' },
          ],
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
        tableColumns: [SITE, 'Good', 'Bad', TOTAL_LABEL],
        tableRows: [
          ['Site 1', '1', '2', '3'],
          ['Site 2', '4 / 4 (100%)', '6 / 6 (100%)', '10'],
        ],
      })
    })
  })
})
