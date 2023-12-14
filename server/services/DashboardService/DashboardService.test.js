import dayjs from 'dayjs'
import DashboardService from '.'
import DashboardDataProcessor from '../../data_processors/DashboardDataProcessor'
import {
  createDb,
  createAnalysisConfig,
  createMatrixData,
} from '../../../test/fixtures'

jest.mock('../../data_processors/DashboardDataProcessor')

const db = createDb()
const config = [
  createAnalysisConfig(),
  createAnalysisConfig({
    label: 'Jump',
    analysis: 'jump_of',
    variable: 'jumpVariable',
    category: 'power',
  }),
  createAnalysisConfig({
    label: 'Read',
    analysis: 'read_of',
    variable: 'readVariable',
    category: 'reading',
  }),
]
const matrixData = [
  createMatrixData({
    analysis: 'size_of',
    category: 'measurements',
    color: ['red', 'blue', 'white'],
    data: [
      {
        day: 1,
        sizeVariable: 30,
      },
      {
        day: 45,
        sizeVariable: 2,
      },
    ],
    label: 'Size',
    range: [1, 2],
    stat: [
      {
        max: 30,
        mean: 16,
        min: 2,
      },
    ],
    variable: 'sizeVariable',
  }),
  createMatrixData({
    analysis: 'jump_of',
    category: 'power',
    color: ['red', 'blue', 'white'],
    data: [
      {
        day: 10,
        jumpVariable: 1,
      },
      {
        day: 20,
        jumpVariable: 30,
      },
    ],
    label: 'Jump',
    range: [1, 2],
    stat: [
      {
        max: 30,
        mean: 15.5,
        min: 1,
      },
    ],
    variable: 'jumpVariable',
  }),
  createMatrixData({
    analysis: 'read_of',
    category: 'reading',
    color: ['red', 'blue', 'white'],
    data: [],
    label: 'Read',
    range: [1, 2],
    stat: [],
    variable: 'readVariable',
  }),
]
const metaDocData = [
  { 'Subject ID': 'CA01' },
  { 'Subject ID': 'YA01', Consent: '03-03-2022' },
  { 'Subject ID': 'LA01' },
]
const study = 'YA'
const subject = 'YA01'
const updatedDate = dayjs().toISOString()

describe(DashboardService, () => {
  describe('createDashboard', () => {
    it('returns an object with the consent date and matrix data properties', async () => {
      const mockcalculateDashboardData = jest.fn()

      db.findOne.mockResolvedValueOnce({
        collection: 'metadoc_collection',
        updated: updatedDate,
      })
      db.find.mockImplementationOnce(() => ({
        toArray: () => metaDocData,
      }))
      DashboardDataProcessor.mockImplementationOnce(() => {
        return {
          calculateDashboardData: mockcalculateDashboardData,
        }
      })
      mockcalculateDashboardData.mockResolvedValueOnce({
        matrixData,
      })

      const dashboardService = new DashboardService(db, study, subject, config)
      const createDashboard = await dashboardService.createDashboard()

      expect(createDashboard).toEqual({
        consentDate: '03-03-2022',
        matrixData,
      })
    })
  })
})
