import AuthController from '.'
import {
  createRequestWithUser,
  createResponse,
  createUser,
} from '../../../test/fixtures'

describe('AuthController', () => {
  describe(AuthController.show, () => {
    describe('When successful', () => {
      it('returns a status of 200 and a user object', async () => {
        const request = createRequestWithUser()
        const response = createResponse()
        const user = createUser()

        request.app.locals.appDb.findOne.mockResolvedValueOnce(user)

        await AuthController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: user,
        })
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error', async () => {
        const request = createRequestWithUser()
        const response = createResponse()

        request.app.locals.appDb.findOne.mockRejectedValueOnce(
          new Error('some error')
        )

        await AuthController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'some error',
        })
      })
    })
  })
})
