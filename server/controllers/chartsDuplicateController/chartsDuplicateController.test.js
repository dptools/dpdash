import { ObjectId } from 'mongodb'
import chartsDuplicateController from '.'
import {
  createChart,
  createRequestWithUser,
  createResponse,
  createFieldLabelValue,
} from '../../../test/fixtures'
import { collections } from '../../utils/mongoCollections'

describe('chartsDuplicateController', () => {
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

      beforeAll(async () => {
        appDb = await global.MONGO_INSTANCE.db('chartsDuplicate')

        await appDb.collection(collections.charts).insertOne(chart)
      })

      afterAll(async () => {
        await appDb.dropDatabase()
      })
      it('returns status of 200 and the new chart id', async () => {
        const body = { chart_id: chart._id.toString() }
        const request = createRequestWithUser({
          body,
          app: { locals: { appDb } },
        })
        const response = createResponse()

        await chartsDuplicateController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledTimes(1)
      })
    })
    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const sourceChart = new ObjectId().toString()
        const body = { chart_id: sourceChart }
        const request = createRequestWithUser(body)
        const response = createResponse()

        request.app.locals.appDb.findOne.mockResolvedValueOnce({
          _id: sourceChart,
        })
        request.app.locals.appDb.insertOne.mockRejectedValueOnce(
          new Error('error message')
        )

        await chartsDuplicateController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'error message',
        })
      })
    })
  })
})
