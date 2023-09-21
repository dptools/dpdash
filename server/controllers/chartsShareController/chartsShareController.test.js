import { ObjectId } from 'mongodb'
import chartsShareController from '.'
import {
  createChart,
  createRequestWithUser,
  createResponse,
} from '../../../test/fixtures'

describe('chartsShareController', () => {
  describe('create', () => {
    describe('When successful', () => {
      it('retusna status of 200 and the new chart id', async () => {
        const sourceChart = ObjectId().toString()
        const sharedWith = ['owl', 'eagle']
        const body = { sharedWith }
        const params = { chart_id: sourceChart }
        const request = createRequestWithUser({ body, params })
        const response = createResponse()
        const chart = createChart({ _id: sourceChart, sharedWith })

        request.app.locals.dataDb.findOneAndUpdate.mockResolvedValueOnce({
          value: chart,
        })

        await chartsShareController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: chart,
        })
      })
    })
    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const sourceChart = ObjectId().toString()
        const sharedWith = ['owl', 'eagle']
        const body = { sharedWith }
        const params = { chart_id: sourceChart }
        const request = createRequestWithUser({ body, params })
        const response = createResponse()

        request.app.locals.dataDb.findOneAndUpdate.mockRejectedValueOnce(
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
