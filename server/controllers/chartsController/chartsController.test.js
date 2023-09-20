import { ObjectId } from 'mongodb'
import chartsController from '.'
import {
  createRequestWithUser,
  createResponse,
  createChart,
  createUser,
} from '../../../test/fixtures'

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
      it('returns a list of charts and a status of 200', async () => {
        const request = createRequestWithUser()
        const response = createResponse()
        const user = createUser()
        const chart = createChart({
          assessment: 'EEG Quick',
          _id: 'chart_eeg_id',
          variable: 'Rating',
          owner: 'user',
        })
        const mockCursor = {
          hasNext: jest
            .fn()
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(false),
          next: jest.fn().mockResolvedValueOnce(chart),
        }

        request.app.locals.dataDb.find.mockResolvedValueOnce(mockCursor)
        request.app.locals.appDb.findOne.mockResolvedValueOnce(user)

        await chartsController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: [
            {
              _id: 'chart_eeg_id',
              assessment: 'EEG Quick',
              chartOwner: {
                display_name: 'Display Name',
                icon: 'icon',
                uid: 'user-uid',
              },
              description: 'chart description',
              fieldLabelValueMap: [
                {
                  color: '#e2860a',
                  label: 'THE VALUE',
                  targetValues: {
                    CA: '50',
                    LA: '30',
                    MA: '21',
                    ProNET: '60',
                    YA: '20',
                  },
                  value: '1',
                },
              ],
              owner: 'user',
              title: 'chart title',
              variable: 'Rating',
            },
          ],
        })
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const request = createRequestWithUser()
        const response = createResponse()

        request.app.locals.dataDb.find.mockRejectedValueOnce(
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
