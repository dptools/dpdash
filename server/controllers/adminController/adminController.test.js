import AdminUsersController from '.'
import {
  createRequestWithUser,
  createResponse,
  createUser,
} from '../../../test/fixtures'

describe('AdminUsersController', () => {
  describe(AdminUsersController.update, () => {
    describe('when successful', () => {
      const request = createRequestWithUser({
        params: { uid: 'uid' },
      })
      const response = createResponse()

      it('sends a status of 200 with a data result', async () => {
        request.app.locals.appDb.findOneAndUpdate.mockResolvedValueOnce({
          uid: 'uid',
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
        request.app.locals.appDb.findOneAndUpdate.mockRejectedValueOnce(
          new Error('some error')
        )

        await AdminUsersController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'some error',
        })
      })
    })
  })

  describe(AdminUsersController.destroy, () => {
    const params = { uid: 'owl' }

    describe('When successful', () => {
      it('returns a status of 204', async () => {
        const request = createRequestWithUser(params)
        const response = createResponse()

        request.app.locals.appDb.deleteOne.mockResolvedValueOnce({
          deletedCount: 1,
        })

        await AdminUsersController.destroy(request, response)

        expect(response.status).toHaveBeenCalledWith(204)
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message property when there is an error', async () => {
        const request = createRequestWithUser(params)
        const response = createResponse()

        request.app.locals.appDb.deleteOne.mockRejectedValueOnce(
          new Error('destroy error')
        )

        await AdminUsersController.destroy(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'destroy error',
        })
      })
    })
  })
})
