import StudiesController from '.'
import { createRequest, createResponse } from '../../../test/fixtures'

describe('StudiesController', () => {
  describe(StudiesController.index, () => {
    describe('When successful', () => {
      it('returns a status of 200 with a list of distinct studies', async () => {
        const request = createRequest()
        const response = createResponse()
        const listOfStudies = ['YA', 'CA', 'LA']

        request.app.locals.dataDb.distinct.mockResolvedValueOnce(listOfStudies)

        await StudiesController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: ['YA', 'CA', 'LA'],
        })
      })
    })
    describe('When unsuccessful', () => {
      it('returns a status of 400 with an error message', async () => {
        const request = createRequest()
        const response = createResponse()

        request.app.locals.dataDb.distinct.mockRejectedValueOnce(
          new Error('some error')
        )

        await StudiesController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'some error',
        })
      })
    })
  })
})
