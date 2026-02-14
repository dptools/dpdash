import userStudiesController from '.'
import {
  createResponse,
  createRequestWithUser,
  createUser,
  createStudyTableRowData,
} from '../../../test/fixtures'
import { createStudies } from '../../../test/testUtils'
import { collections } from '../../utils/mongoCollections'

describe('userStudiesController', () => {
  describe(userStudiesController.index, () => {
    describe('When successful', () => {
      let appDb
      let user

      beforeAll(async () => {
        user = createUser({
          uid: 'owl',
          preferences: {},
          access: ['YA', 'LA', 'MA'],
        })

        appDb = await global.MONGO_INSTANCE.db('studies')

        await appDb.collection(collections.users).insertOne(user)
        await appDb.collection(collections.metadata).insertMany(createStudies())
      })
      afterAll(async () => {
        await appDb.dropDatabase()
      })

      it('returns a list of studies with the column properties to be displayed', async () => {
        const response = createResponse()
        const request = createRequestWithUser(
          {
            query: { sort: {} },
            app: { locals: { appDb } },
          },
          user
        )
        const data = [
          createStudyTableRowData({
            daysInStudy: 655,
            numOfParticipants: 2,
            study: 'LA',
            updatedAt: new Date('01-05-2024'),
          }),
          createStudyTableRowData({
            daysInStudy: 1005,
            numOfParticipants: 2,
            study: 'MA',
            updatedAt: new Date('01-05-2024'),
          }),
          createStudyTableRowData({
            daysInStudy: 105,
            numOfParticipants: 2,
            study: 'YA',
            updatedAt: new Date('01-05-2024'),
          }),
        ]
        await userStudiesController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data,
        })
      })

      it('returns a list using default sort properties if sort property is missing', async () => {
        const response = createResponse()
        const request = createRequestWithUser(
          {
            query: {},
            app: { locals: { appDb } },
          },
          user
        )
        const data = [
          createStudyTableRowData({
            daysInStudy: 655,
            numOfParticipants: 2,
            study: 'LA',
            updatedAt: new Date('01-05-2024'),
          }),
          createStudyTableRowData({
            daysInStudy: 1005,
            numOfParticipants: 2,
            study: 'MA',
            updatedAt: new Date('01-05-2024'),
          }),
          createStudyTableRowData({
            daysInStudy: 105,
            numOfParticipants: 2,
            study: 'YA',
            updatedAt: new Date('01-05-2024'),
          }),
        ]

        await userStudiesController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data,
        })
      })
    })
    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error', async () => {
        const request = createRequestWithUser({ query: { sort: {} } })
        const response = createResponse()

        request.app.locals.appDb.findOne.mockRejectedValueOnce(
          new Error('some error')
        )

        await userStudiesController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          message: 'some error',
        })
      })
    })
  })
})
