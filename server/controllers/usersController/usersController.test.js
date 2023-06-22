import UsersController from '.'
import {
  createRequestWithUser,
  createResponse,
  createUser,
} from '../../../test/fixtures'

describe('UsersController', () => {
  const params = { uid: 'owl' }

  describe(UsersController.show, () => {
    describe('When successful', () => {
      it('returns a status of 200 and a user object', async () => {
        const request = createRequestWithUser({ params })
        const response = createResponse()

        request.app.locals.appDb.findOne.mockResolvedValue(
          createUser({
            uid: 'owl',
            name: 'Eaurasian Eagle Owl',
          })
        )

        await UsersController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: {
            uid: 'owl',
            name: 'Eaurasian Eagle Owl',
            display_name: 'Display Name',
            icon: 'icon',
          },
        })
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const request = createRequestWithUser({ params })
        const response = createResponse()

        request.app.locals.appDb.findOne.mockImplementation(() => {
          throw new Error('some error')
        })

        await UsersController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'some error',
        })
      })
    })
  })

  describe(UsersController.edit, () => {
    const body = { name: 'Eaurasian Eagle Owl' }

    describe('When successful', () => {
      it('sends a status of 200 with a data result', async () => {
        const request = createRequestWithUser({ params, body })
        const response = createResponse()

        request.app.locals.appDb.findOneAndUpdate.mockResolvedValueOnce({
          value: createUser({
            name: 'Eaurasian Eagle Owl',
            owner: 'owl',
          }),
        })

        await UsersController.edit(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: {
            display_name: 'Display Name',
            icon: 'icon',
            name: 'Eaurasian Eagle Owl',
            owner: 'owl',
            uid: 'user-uid',
          },
        })
      })
    })

    describe('when unsuccessful', () => {
      it('returns a 400 error with the error message', async () => {
        const request = createRequestWithUser({ params, body })
        const response = createResponse()

        request.app.locals.appDb.findOneAndUpdate.mockRejectedValueOnce(
          new Error('User could not be updated')
        )

        await UsersController.edit(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'User could not be updated',
        })
      })
    })
  })
})
