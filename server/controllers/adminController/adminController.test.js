import AdminUsersController from '.'
import { createRequestWithUser, createResponse } from '../../../test/fixtures'

describe('AdminUsersController', () => {
  describe(AdminUsersController.update, () => {
    const request = createRequestWithUser({
      params: { uid: 'uid' },
    })
    const response = createResponse()

    describe('when successful', () => {
      it('sends a status of 200 with a data result', async () => {
        request.app.locals.appDb.updateOne.mockResolvedValueOnce({
          modifiedCount: 1,
        })

        await AdminUsersController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: { modifiedCount: 1 },
        })
      })
    })

    describe('when unsuccessful', () => {
      it('returns a 404 error with the error message', async () => {
        request.app.locals.appDb.updateOne.mockResolvedValueOnce({
          modifiedCount: 0,
        })

        await AdminUsersController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(404)
        expect(response.json).toHaveBeenCalledWith({
          message: 'User could not be updated',
        })
      })
    })

    describe('when error', () => {
      it('returns a 404 error with the error message', async () => {
        request.app.locals.appDb.updateOne.mockRejectedValueOnce(
          new Error('User could not be updated')
        )

        await AdminUsersController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(404)
        expect(response.json).toHaveBeenCalledWith({
          message: 'User could not be updated',
        })
      })
    })
  })
})
