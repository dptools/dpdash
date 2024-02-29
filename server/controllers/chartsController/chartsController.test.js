import { ObjectId } from 'mongodb'
import chartsController from '.'
import {
  createRequestWithUser,
  createResponse,
  createChart,
  createUser,
  createFieldLabelValue,
} from '../../../test/fixtures'
import { collections } from '../../utils/mongoCollections'
import UserModel from '../../models/UserModel'

describe('chartsController', () => {
  describe('create', () => {
    describe('When successful', () => {
      let appDb
      let user

      beforeAll(async () => {
        user = createUser({
          uid: 'owl',
          preferences: {},
          access: ['YA', 'LA', 'MA'],
        })
        appDb = await global.MONGO_INSTANCE.db('chartsCreate')

        await appDb.collection(collections.users).insertOne(user)
      })

      afterAll(async () => {
        await appDb.dropDatabase()
      })
      it('returns a status of 200 and a chart_id', async () => {
        const body = createChart(
          {
            title: 'Eeg Measurements',
            description: 'Participant EEG Measurements',
            assessment: 'eeg',
            variable: 'eeg',
            public: false,
            owner: 'owl',
          },
          [
            createFieldLabelValue({
              value: 'bar',
              label: 'Bar',
              color: 'red',
              targetValues: {
                LA: '2',
                YA: '1',
                MA: '2',
              },
            }),
          ]
        )
        const request = createRequestWithUser({
          app: { locals: { appDb }, body },
        })
        const response = createResponse()

        await chartsController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledTimes(1)
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const request = createRequestWithUser()
        const response = createResponse()

        request.app.locals.appDb.insertOne.mockImplementation(() => {
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
      let appDb

      beforeAll(async () => {
        appDb = await global.MONGO_INSTANCE.db('chartsIndex')
      })

      beforeEach(async () => {
        await appDb.createCollection(collections.charts)
        await appDb.createCollection(collections.users)
      })

      afterEach(async () => {
        await appDb.collection(collections.users).drop()
        await appDb.collection(collections.charts).drop()
      })

      afterAll(async () => {
        await appDb.dropDatabase()
      })

      it('returns a list of charts in order of user favorite, title, alongside a status of 200', async () => {
        const [chart1, chart2, chart3] = [
          createChart({
            _id: new ObjectId(),
            title: 'LES',
            description: 'Participant EEG Measurements',
            assessment: 'EEG Quick',
            variable: 'Rating',
            public: false,
            owner: 'owl',
          }),
          createChart({
            _id: new ObjectId(),
            title: 'Eeg Measurements',
            description: 'Participant EEG Measurements',
            assessment: 'Foo',
            variable: 'Rating',
            public: false,
            owner: 'owl',
          }),
          createChart(
            {
              _id: new ObjectId(),
              title: 'Eeg Measurements',
              description: 'Participant EEG Measurements',
              assessment: 'eeg',
              variable: 'eeg',
              public: false,
              owner: 'owl',
            },
            [
              createFieldLabelValue({
                value: 'bar',
                label: 'Bar',
                color: 'red',
                targetValues: {
                  LA: '2',
                  YA: '1',
                  MA: '2',
                },
              }),
            ]
          ),
        ]
        const user = createUser({
          uid: 'owl',
          favoriteCharts: [chart3._id.toString()],
        })
        await appDb.collection(collections.users).insertOne(user)
        await appDb
          .collection(collections.charts)
          .insertMany([chart1, chart2, chart3])

        const request = createRequestWithUser(
          {
            app: { locals: { appDb } },
            query: { sortBy: 'title', sortDirection: 'ASC' },
          },
          await UserModel.findOne(appDb, { uid: user.uid })
        )

        const response = createResponse()
        const { _id, ...restOfUser } = user

        await chartsController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: [
            {
              ...chart3,
              chartOwner: restOfUser,
              favorite: true,
              chart_id: chart3._id.toString(),
            },
            {
              ...chart2,
              chartOwner: restOfUser,
              favorite: false,
              chart_id: chart2._id.toString(),
            },
            {
              ...chart1,
              chartOwner: restOfUser,
              favorite: false,
              chart_id: chart1._id.toString(),
            },
          ],
        })
      })

      it('returns a list of charts that match the search query, the results are sorted by favorites first then title', async () => {
        const [chart1, chart2, chart3] = [
          createChart({
            _id: new ObjectId(),
            title: 'recent chart',
            assessment: 'EEG',
            variable: 'Rating',
            owner: 'owl',
          }),
          createChart({
            _id: new ObjectId(),
            title: 'EEG',
            assessment: 'EEG Drive',
            variable: 'drtive',
            owner: 'owl',
            title: 'all charts',
          }),
          createChart({
            _id: new ObjectId(),
            title: 'recent chart',
            assessment: 'Foo',
            variable: 'Rating',
            owner: 'anotherUser',
            sharedWith: ['owl'],
          }),
        ]
        const { user, anotherUser } = {
          user: createUser({
            uid: 'owl',
            favoriteCharts: [chart3._id.toString()],
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
        await appDb
          .collection(collections.charts)
          .insertMany([chart1, chart2, chart3])

        const request = createRequestWithUser(
          {
            app: { locals: { appDb } },
            query: { search: 'recent', sortBy: 'title', sortDirection: 'ASC' },
          },
          await UserModel.findOne(appDb, { uid: user.uid })
        )
        const response = createResponse()

        await chartsController.index(request, response)

        expect(response.json).toHaveBeenCalledWith({
          data: [
            {
              ...chart3,
              chartOwner: restOfanotherUser,
              favorite: true,
              chart_id: chart3._id.toString(),
            },
            {
              ...chart1,
              chartOwner: restOfUser,
              favorite: false,
              chart_id: chart1._id.toString(),
            },
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
      let appDb
      let user
      const chart_id = new ObjectId()

      beforeAll(async () => {
        user = createUser({
          uid: 'owl',
          preferences: {},
          access: ['YA', 'LA', 'MA'],
        })
        appDb = await global.MONGO_INSTANCE.db('chartsDestroy')

        await appDb.collection(collections.charts).insertOne(
          createChart(
            {
              _id: chart_id,
              title: 'Eeg Measurements',
              description: 'Participant EEG Measurements',
              assessment: 'eeg',
              variable: 'eeg',
              public: false,
              owner: 'owl',
            },
            [
              createFieldLabelValue({
                value: 'bar',
                label: 'Bar',
                color: 'red',
                targetValues: {
                  LA: '2',
                  YA: '1',
                  MA: '2',
                },
              }),
            ]
          )
        )
        await appDb.collection(collections.users).insertOne(user)
      })

      afterAll(async () => {
        await appDb.dropDatabase()
      })
      it('returns a status of 204', async () => {
        const request = createRequestWithUser(
          {
            params: { chart_id: chart_id.toString() },
            app: { locals: { appDb } },
          },
          { uid: 'owl' }
        )
        const response = createResponse()

        await chartsController.destroy(request, response)

        expect(response.status).toHaveBeenCalledWith(204)
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const params = { chart_id: 'some-id' }
        const request = createRequestWithUser(params, { uid: 'user-id' })
        const response = createResponse()

        request.app.locals.appDb.findOne.mockResolvedValueOnce({
          owner: 'user-id',
        })
        request.app.locals.appDb.deleteOne.mockRejectedValueOnce(
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
      let appDb
      let user
      const chart_id = new ObjectId()

      beforeAll(async () => {
        user = createUser({
          uid: 'owl',
          preferences: {},
          access: ['YA', 'LA', 'MA'],
        })
        appDb = await global.MONGO_INSTANCE.db('chartsShow')

        await appDb.collection(collections.charts).insertOne(
          createChart(
            {
              _id: chart_id,
              title: 'Eeg Measurements',
              description: 'Participant EEG Measurements',
              assessment: 'eeg',
              variable: 'eeg',
              public: false,
              owner: 'owl',
            },
            [
              createFieldLabelValue({
                value: 'bar',
                label: 'Bar',
                color: 'red',
                targetValues: {
                  LA: '2',
                  YA: '1',
                  MA: '2',
                },
              }),
            ]
          )
        )
        await appDb.collection(collections.users).insertOne(user)
      })

      afterAll(async () => {
        await appDb.dropDatabase()
      })
      it('returns a status of 200 and a chart', async () => {
        const userOverrides = { access: ['YA', 'CA'], uid: 'owl' }
        const request = createRequestWithUser(
          {
            app: { locals: { appDb } },
            params: { chart_id: chart_id.toString() },
          },
          userOverrides
        )
        const response = createResponse()

        await chartsController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: {
            _id: chart_id,
            assessment: 'eeg',
            description: 'Participant EEG Measurements',
            fieldLabelValueMap: [
              {
                color: '#e2860a',
                label: 'Foo',
                targetValues: {
                  CA: '',
                  LA: '3',
                  MA: '3',
                  YA: '3',
                },
                value: 'foo',
              },
              {
                color: 'red',
                label: 'Bar',
                targetValues: {
                  CA: '',
                  LA: '2',
                  MA: '2',
                  YA: '1',
                },
                value: 'bar',
              },
            ],
            owner: 'owl',
            public: false,
            title: 'Eeg Measurements',
            variable: 'eeg',
          },
        })
      })
    })
    describe('When unsucessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const params = { chart_id: 'chart-id' }
        const request = createRequestWithUser(params)
        const response = createResponse()

        request.app.locals.appDb.findOne.mockRejectedValueOnce(
          new Error('some error')
        )

        await chartsController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'some error',
        })
      })
    })
  })

  describe('update', () => {
    describe('When successful', () => {
      let appDb
      let user
      const chart_id = new ObjectId()

      beforeAll(async () => {
        user = createUser({
          uid: 'owl',
          preferences: {},
          access: ['YA', 'LA', 'MA'],
        })
        appDb = await global.MONGO_INSTANCE.db('chartsUpdate')

        await appDb.collection(collections.charts).insertOne(
          createChart(
            {
              _id: chart_id,
              title: 'Eeg Measurements',
              description: 'Participant EEG Measurements',
              assessment: 'eeg',
              variable: 'eeg',
              public: false,
              owner: 'owl',
            },
            [
              createFieldLabelValue({
                value: 'bar',
                label: 'Bar',
                color: 'red',
                targetValues: {
                  LA: '2',
                  YA: '1',
                  MA: '2',
                },
              }),
            ]
          )
        )
        await appDb.collection(collections.users).insertOne(user)
      })

      afterAll(async () => {
        await appDb.dropDatabase()
      })
      it('returns a status of 200 and an updated chart', async () => {
        const params = { chart_id: chart_id.toString() }
        const body = createChart(
          {
            title: 'New Title',
            description: 'Participant EEG Measurements',
            assessment: 'eeg',
            variable: 'eeg',
            public: false,
            owner: 'owl',
          },
          [
            createFieldLabelValue({
              value: 'bar',
              label: 'Bar',
              color: 'red',
              targetValues: {
                LA: '2',
                YA: '1',
                MA: '2',
              },
            }),
          ]
        )
        const request = createRequestWithUser({
          app: { locals: { appDb } },
          params,
          body,
        })
        const response = createResponse()

        await chartsController.update(request, response)
        const updatedChart = await appDb
          .collection(collections.charts)
          .findOne({
            _id: chart_id,
          })

        expect(response.status).toHaveBeenCalledWith(200)
        expect(updatedChart.title).toEqual('New Title')
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const params = { chart_id: new ObjectId().toString() }
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

        request.app.locals.appDb.findOneAndUpdate.mockRejectedValueOnce(
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
