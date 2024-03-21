import { ObjectId } from 'mongodb'
import chartsShareController from '.'
import {
  createChart,
  createRequestWithUser,
  createResponse,
  createFieldLabelValue,
} from '../../../test/fixtures'
import { collections } from '../../utils/mongoCollections'

describe('chartsShareController', () => {
  describe('create', () => {
    describe('When successful', () => {
      let appDb
      const chart = createChart(
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
      )

      beforeAll(() => {
        appDb = global.MONGO_INSTANCE.db('chartsShare')
      })
      beforeEach(async () => {
        await appDb.collection(collections.charts).insertOne(chart)
      })
      afterEach(async () => {
        await appDb.collection('charts').drop()
      })
      afterAll(async () => {
        await appDb.dropDatabase()
      })

      it('returns status of 200 and the new chart id', async () => {
        const sharedWith = ['eagle']
        const body = { sharedWith }
        const params = { chart_id: chart._id.toString() }
        const request = createRequestWithUser(
          { body, params, app: { locals: { appDb } } },
          { uid: 'owl' }
        )
        const response = createResponse()

        await chartsShareController.create(request, response)

        const updatedChart = await appDb
          .collection(collections.charts)
          .findOne({ _id: chart._id })

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: updatedChart,
        })
      })
    })
    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const sourceChart = new ObjectId().toString()
        const sharedWith = ['owl', 'eagle']
        const body = { sharedWith }
        const params = { chart_id: sourceChart }
        const request = createRequestWithUser({ body, params })
        const response = createResponse()

        request.app.locals.appDb.findOneAndUpdate.mockRejectedValueOnce(
          new Error('update error')
        )

        await chartsShareController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'Chart could not be shared',
        })
      })
    })
  })
})
