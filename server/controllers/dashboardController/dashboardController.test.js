import { ObjectId } from 'mongodb'
import DashboardsController from '.'
import {
  createConfiguration,
  createRequestWithUser,
  createResponse,
  createUser,
  createAnalysisConfig,
  createParticipantDayData,
} from '../../../test/fixtures'
import { collections } from '../../utils/mongoCollections'

describe('Dashboard Controller', () => {
  describe(DashboardsController.show, () => {
    describe('When successful', () => {
      let appDb
      let user
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
      const newConfiguration = createConfiguration({
        _id: new ObjectId(),
        config: {
          0: configAnalysisData,
        },
      })
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
        user = createUser({
          uid: 'owl',
          preferences: {
            config: newConfiguration._id.toString(),
          },
          access: ['YA', 'LA', 'MA'],
        })
        appDb = await global.MONGO_INSTANCE.db('matrix')
        await appDb.collection(collections.configs).insertOne(newConfiguration)
        await appDb
          .collection(collections.assessmentDayData)
          .insertMany([dataOne, dataTwo])
        await appDb.collection(collections.users).insertOne(user)
        await appDb.collection(collections.metadata).insertOne({
          study: 'YA',
          participants: [
            { participant: 'YA01', Consent: new Date('2022-02-26') },
          ],
        })
      })
      afterAll(async () => await appDb.dropDatabase())

      it('returns a status of 200 and a user object', async () => {
        const study = 'YA'
        const subject = 'YA01'
        const params = {
          study,
          subject,
        }
        const request = createRequestWithUser(
          { app: { locals: { appDb } }, params },
          user
        )
        const response = createResponse()

        await DashboardsController.show(request, response)
        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: {
            graph: {
              configurations: [
                {
                  analysis: 'jump_of',
                  category: 'power',
                  color: [],
                  label: 'Jump',
                  range: [],
                  variable: 'jumpVariable',
                },
                {
                  analysis: 'size_of',
                  category: 'sizeing',
                  color: [],
                  label: 'Size',
                  range: [],
                  variable: 'sizeVariable',
                },
              ],
              consentDate: new Date('2022-02-26T00:00:00.000Z'),
              matrixData: [
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
              ],
            },
            subject: {
              project: 'YA',
              sid: 'YA01',
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
