import ApiUsersController from '.'
import {
  createRequestWithUser,
  createResponse,
  createUser,
} from '../../../test/fixtures'

describe('ApiUsersController', () => {
  describe(ApiUsersController.index, () => {
    describe('When successful', () => {
      it('returns a status of 200 and a collection of user objects', async () => {
        const users = [createUser({ uid: 1 }), createUser({ uid: 2 })]
        const request = createRequestWithUser()
        const response = createResponse()

        request.app.locals.appDb.toArray.mockResolvedValueOnce(users)

        await ApiUsersController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: users,
        })
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const request = createRequestWithUser()
        const response = createResponse()

        request.app.locals.appDb.find.mockImplementationOnce(() => {
          throw new Error('some error')
        })

        await ApiUsersController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'some error',
        })
      })
    })
  })
})
