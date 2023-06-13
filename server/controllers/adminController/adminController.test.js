import AdminUsersController from '.'
import { createRequestWithUser, createResponse } from '../../../test/fixtures'

describe('AdminUsersController', () => {
  describe(AdminUsersController.update, () => {
    describe('when successful', () => {
      const request = createRequestWithUser({
        params: { uid: 'uid' },
      })
      const response = createResponse()

      it('sends a status of 200 with a data result', async () => {
        request.app.locals.appDb.findOneAndUpdate.mockResolvedValueOnce({
          value: { uid: 'uid' },
        })

        await AdminUsersController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: { uid: 'uid' },
        })
      })
    })

    describe('when unsuccessful', () => {
      const request = createRequestWithUser({
        params: { uid: 'uid' },
      })
      const response = createResponse()

      it('returns a 404 error with the error message', async () => {
        request.app.locals.appDb.findOneAndUpdate.mockResolvedValueOnce({})

        await AdminUsersController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(404)
      })
    })

    describe('when error', () => {
      const request = createRequestWithUser({
        params: { uid: 'uid' },
      })
      const response = createResponse()

      it('returns a 500 error with the error message', async () => {
        request.app.locals.appDb.findOneAndUpdate.mockRejectedValueOnce(
          new Error('User could not be updated')
        )

        await AdminUsersController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(500)
        expect(response.json).toHaveBeenCalledWith({
          error: 'User could not be updated',
        })
      })
    })
  })
})
