import { ObjectId } from 'mongodb'
import DashboardsController from '.'
import {
  createConfiguration,
  createRequestWithUser,
  createResponse,
  createUser,
  createAnalysisConfig,
  createMatrixData,
} from '../../../test/fixtures'
import DashboardService from '../../services/DashboardService'

jest.mock('../../services/DashboardService')

describe('Dashboard Controller', () => {
  describe(DashboardsController.show, () => {
    describe('When successful', () => {
      const configAnalysisData = [
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

      beforeAll(() => {
        DashboardService.mockImplementation(() => {
          return {
            createDashboard: () => ({
              configurations: configAnalysisData,
              consentDate: '03-03-2022',
              matrixData,
            }),
          }
        })
      })

      afterEach(() => {
        jest.resetAllMocks()
      })

      it('returns a status of 200 and a user object', async () => {
        const study = 'studyA'
        const subject = 'subjectA'
        const params = {
          study,
          subject,
        }
        const currentUser = createUser({
          uid: 'owl',
          preferences: {
            config: ObjectId().toString(),
          },
        })
        const currentConfiguration = createConfiguration({
          config: {
            0: configAnalysisData,
          },
        })
        const request = createRequestWithUser({ params })
        const response = createResponse()

        request.app.locals.appDb.findOne.mockResolvedValueOnce(currentUser)
        request.app.locals.appDb.findOne.mockResolvedValueOnce(
          currentConfiguration
        )

        await DashboardsController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: {
            graph: {
              configurations: configAnalysisData,
              consentDate: '03-03-2022',
              matrixData,
            },
            subject: {
              project: 'studyA',
              sid: 'subjectA',
            },
          },
        })
      })
    })
    describe('When unsuccessful', () => {
      it('returns a status of 500 and an error', async () => {
        const study = 'studyA'
        const subject = 'subjectA'
        const params = {
          study,
          subject,
        }
        const request = createRequestWithUser({ params })
        const response = createResponse()

        request.app.locals.appDb.findOne.mockImplementation(() => {
          throw new Error('some error')
        })

        await DashboardsController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(500)
        expect(response.json).toHaveBeenCalledWith({ message: 'some error' })
      })
    })
  })
})
