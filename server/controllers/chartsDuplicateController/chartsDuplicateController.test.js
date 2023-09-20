import { ObjectId } from 'mongodb'
import chartsDuplicateController from '.'
import { createRequestWithUser, createResponse } from '../../../test/fixtures'

describe('chartsDuplicateController', () => {
  describe('create', () => {
    describe('When successful', () => {
      it('retusna status of 200 and the new chart id', async () => {
        const sourceChart = ObjectId().toString()
        const body = { chart_id: sourceChart }
        const newChartId = ObjectId().toString()
        const request = createRequestWithUser(body)
        const response = createResponse()

        request.app.locals.dataDb.findOne.mockResolvedValueOnce({
          _id: sourceChart,
        })

        request.app.locals.dataDb.insertOne.mockResolvedValueOnce({
          insertedId: newChartId,
        })

        await chartsDuplicateController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: newChartId,
        })
      })
    })
    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const sourceChart = ObjectId().toString()
        const body = { chart_id: sourceChart }
        const request = createRequestWithUser(body)
        const response = createResponse()

        request.app.locals.dataDb.findOne.mockResolvedValueOnce({
          _id: sourceChart,
        })
        request.app.locals.dataDb.insertOne.mockRejectedValueOnce(
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
