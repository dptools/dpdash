import DashboardService from '.'
import {
  createAnalysisConfig,
  createParticipantDayData,
} from '../../../test/fixtures'
import { collections } from '../../utils/mongoCollections'

describe(DashboardService, () => {
  describe('methods', () => {
    describe('createMatrix', () => {
      let appDb

      const configAnalysisData = [
        createAnalysisConfig({
          label: 'Jump',
          analysis: 'jump_of',
          variable: 'jumpVariable',
          category: 'power',
        }),
        createAnalysisConfig({
          label: 'Size',
          analysis: 'size_of',
          variable: 'sizeVariable',
          category: 'sizeing',
        }),
      ]

      const dataOne = {
        study: 'YA',
        assessment: 'jump_of',
        participant: 'YA01',
        dayData: [
          createParticipantDayData({
            day: 10,
            jumpVariable: 1,
          }),
          createParticipantDayData({
            day: 20,
            jumpVariable: 30,
          }),
        ],
      }
      const dataTwo = {
        study: 'YA',
        participant: 'YA01',
        assessment: 'size_of',
        dayData: [
          createParticipantDayData({
            day: 1,
            sizeVariable: 30,
          }),
          createParticipantDayData({
            day: 45,
            sizeVariable: 2,
          }),
        ],
      }

      beforeAll(async () => {
        appDb = await global.MONGO_INSTANCE.db('dashService')

        await appDb
          .collection(collections.assessmentDayData)
          .insertMany([dataOne, dataTwo])
        await appDb.collection(collections.metadata).insertOne({
          study: 'YA',
          participants: [
            { participant: 'YA01', Consent: new Date('2022-02-26') },
          ],
        })
      })
      afterAll(async () => await appDb.dropDatabase())

      it('returns a list of prepared matrix data', async () => {
        const dashboardService = new DashboardService(
          appDb,
          'YA',
          'YA01',
          configAnalysisData
        )
        const matrixData = await dashboardService.createMatrix()

        expect(matrixData).toEqual([
          {
            analysis: 'jump_of',
            category: 'power',
            color: [],
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
            range: [],
            stat: [
              {
                max: 30,
                mean: 15.5,
                min: 1,
              },
            ],
            variable: 'jumpVariable',
          },
          {
            analysis: 'size_of',
            category: 'sizeing',
            color: [],
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
            range: [],
            stat: [
              {
                max: 30,
                mean: 16,
                min: 2,
              },
            ],
            variable: 'sizeVariable',
          },
        ])
      })
    })
  })
})
