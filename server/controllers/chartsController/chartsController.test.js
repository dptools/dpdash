import { ObjectId } from 'mongodb'
import chartsController from '.'
import {
  createRequestWithUser,
  createResponse,
  createChart,
  createUser,
} from '../../../test/fixtures'
import { collections } from '../../utils/mongoCollections'

let dataDb
let appDb

describe('chartsController', () => {
  describe('create', () => {
    describe('When successful', () => {
      it('returns a status of 200 and a chart_id', async () => {
        const request = createRequestWithUser()
        const response = createResponse()

        request.app.locals.dataDb.insertOne.mockResolvedValueOnce({
          insertedId: 'chart-id',
        })

        await chartsController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: { chart_id: 'chart-id' },
        })
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const request = createRequestWithUser()
        const response = createResponse()

        request.app.locals.dataDb.insertOne.mockImplementation(() => {
          throw new Error('some error')
        })

        await chartsController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          message: 'some error',
        })
      })
    })
  })

  describe('index', () => {
    describe('When successful', () => {
      beforeAll(async () => {
        dataDb = await global.MONGO_INSTANCE.db('dpdata')
        appDb = await global.MONGO_INSTANCE.db('appDb')
      })

      beforeEach(async () => {
        await dataDb.createCollection(collections.charts)
      })

      afterEach(async () => {
        await appDb.collection(collections.users).drop()
        await dataDb.collection(collections.charts).drop()
      })

      it('returns a list of charts in order of user favorite, title, alongside a status of 200', async () => {
        const [chart1, chart2, chart3] = [
          createChart({
            assessment: 'EEG Quick',
            variable: 'Rating',
            owner: 'user',
          }),
          createChart({
            assessment: 'EEG Drive',
            variable: 'drtive',
            owner: 'user',
            title: 'all charts',
          }),
          createChart({
            assessment: 'Foo',
            variable: 'Rating',
            owner: 'user',
          }),
        ]
        const user = createUser({
          uid: 'user',
          favoriteCharts: [chart3._id],
        })
        await appDb.collection(collections.users).insertOne(user)
        await dataDb
          .collection(collections.charts)
          .insertMany([chart1, chart2, chart3])

        const request = createRequestWithUser({
          app: { locals: { dataDb: dataDb, appDb: appDb } },
          user: 'user',
        })
        const response = createResponse()
        const { _id, ...restOfUser } = user

        await chartsController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: [
            { ...chart3, chartOwner: restOfUser, favorite: true },
            { ...chart2, chartOwner: restOfUser, favorite: false },
            { ...chart1, chartOwner: restOfUser, favorite: false },
          ],
        })
      })

      it('returns a list of charts that match the search query, the results are sorted by favorites first then title', async () => {
        const [chart1, chart2, chart3] = [
          createChart({
            title: 'recent chart',
            assessment: 'EEG',
            variable: 'Rating',
            owner: 'user',
          }),
          createChart({
            title: 'EEG',
            assessment: 'EEG Drive',
            variable: 'drtive',
            owner: 'user',
            title: 'all charts',
          }),
          createChart({
            title: 'recent chart',
            assessment: 'Foo',
            variable: 'Rating',
            owner: 'anotherUser',
            sharedWith: ['user'],
          }),
        ]
        const { user, anotherUser } = {
          user: createUser({
            uid: 'user',
            favoriteCharts: [chart3._id],
          }),
          anotherUser: createUser({
            uid: 'anotherUser',
          }),
        }
        const { _id, ...restOfUser } = user
        const { _id: _x, ...restOfanotherUser } = anotherUser

        await appDb
          .collection(collections.users)
          .insertMany([user, anotherUser])
        await dataDb
          .collection(collections.charts)
          .insertMany([chart1, chart2, chart3])

        const request = createRequestWithUser({
          app: { locals: { dataDb: dataDb, appDb: appDb } },
          query: { search: 'recent' },
          user: 'user',
        })
        const response = createResponse()

        await chartsController.index(request, response)

        expect(response.json).toHaveBeenCalledWith({
          data: [
            { ...chart3, chartOwner: restOfanotherUser, favorite: true },
            { ...chart1, chartOwner: restOfUser, favorite: false },
          ],
        })
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const request = createRequestWithUser()
        const response = createResponse()

        request.app.locals.appDb.findOne.mockRejectedValueOnce(
          new Error('Rejected error message')
        )

        await chartsController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'Rejected error message',
        })
      })
    })
  })

  describe('destroy', () => {
    describe('When successful', () => {
      it('returns a status of 204', async () => {
        const params = { chart_id: 'chart-id' }
        const request = createRequestWithUser(params)
        const response = createResponse()

        request.app.locals.dataDb.findOne.mockResolvedValueOnce({
          owner: 'user-id',
        })
        request.app.locals.dataDb.deleteOne.mockResolvedValueOnce({
          deletedCount: 1,
        })

        await chartsController.destroy(request, response)

        expect(response.status).toHaveBeenCalledWith(204)
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const params = { chart_id: 'some-id' }
        const request = createRequestWithUser(params)
        const response = createResponse()

        request.app.locals.dataDb.findOne.mockResolvedValueOnce({
          owner: 'user-id',
        })
        request.app.locals.dataDb.deleteOne.mockRejectedValueOnce(
          new Error('Some error')
        )

        await chartsController.destroy(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'Some error',
        })
      })
    })
  })

  describe('show', () => {
    describe('When successful', () => {
      it('returns a status of 200 and a chart', async () => {
        const params = { chart_id: 'chart-id' }
        const request = createRequestWithUser(params)
        const response = createResponse()
        const chart = createChart()

        request.app.locals.dataDb.findOne.mockResolvedValueOnce(chart)

        await chartsController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: chart,
        })
      })
    })

    describe('When unsucessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const params = { chart_id: 'chart-id' }
        const request = createRequestWithUser(params)
        const response = createResponse()

        request.app.locals.dataDb.findOne.mockRejectedValueOnce(
          new Error('Chart does not exist')
        )

        await chartsController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'Chart does not exist',
        })
      })
    })
  })

  describe('update', () => {
    describe('When successful', () => {
      it('returns a status of 200 and an updated chart', async () => {
        const params = { chart_id: ObjectId().toString() }
        const body = {
          title: 'New title',
          variable: 'Rating',
          assessment: 'EEGquick',
          description: 'EEG Rating',
          public: false,
        }
        const updatedChart = createChart(body)
        const request = createRequestWithUser({
          params,
          body,
        })
        const response = createResponse()

        request.app.locals.dataDb.findOneAndUpdate.mockResolvedValueOnce({
          value: updatedChart,
        })

        await chartsController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: updatedChart,
        })
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const params = { chart_id: ObjectId().toString() }
        const body = {
          title: 'New title',
          variable: 'Rating',
          assessment: 'EEGquick',
          description: 'EEG Rating',
          public: false,
        }
        const request = createRequestWithUser({
          params,
          body,
        })
        const response = createResponse()

        request.app.locals.dataDb.findOneAndUpdate.mockRejectedValueOnce(
          new Error('Chart not found error')
        )

        await chartsController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'Chart not found error',
        })
      })
    })
  })
})
