import ConfigurationsController from '.'
import {
  createRequestWithUser,
  createResponse,
  createConfiguration,
} from '../../../test/fixtures'

describe('ConfigurationsController', () => {
  describe(ConfigurationsController.create, () => {
    const newConfiguration = { body: { name: 'new matrix', owner: 'owl' } }

    describe('When successful', () => {
      const request = createRequestWithUser(newConfiguration)
      const response = createResponse()

      it('sends a status of 200 with a data property when successful', async () => {
        const insertedConfiguration = createConfiguration()

        request.app.locals.appDb.insertOne.mockResolvedValueOnce({
          insertedCount: 1,
          insertedId: 'eagle',
        })
        request.app.locals.appDb.findOne.mockResolvedValueOnce(
          insertedConfiguration
        )

        await ConfigurationsController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: insertedConfiguration,
        })
      })
    })

    describe('When unsuccessful', () => {
      it('sends a status of 400 with a message when database there is an error', async () => {
        const request = createRequestWithUser(newConfiguration)
        const response = createResponse()

        request.app.locals.appDb.insertOne.mockRejectedValueOnce(
          new Error('Rejected error message')
        )

        await ConfigurationsController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'Rejected error message',
        })
      })
    })
  })

  describe(ConfigurationsController.update, () => {
    const configAttributes = { body: { name: 'new matrix', owner: 'owl' } }

    describe('When successful', () => {
      it('sends a status of 200 and with a data payload', async () => {
        const request = createRequestWithUser(configAttributes)
        const response = createResponse()
        const updatedConfiguration = createConfiguration({
          owner: 'owl',
          type: 'new matrix ',
        })

        request.app.locals.appDb.findOneAndUpdate.mockResolvedValueOnce({
          value: updatedConfiguration,
        })

        await ConfigurationsController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: updatedConfiguration,
        })
      })
    })

    describe('When unsuccessful', () => {
      it('sends a status of 422 with a message when database there is an error', async () => {
        const request = createRequestWithUser(configAttributes)
        const response = createResponse()

        request.app.locals.appDb.findOneAndUpdate.mockRejectedValueOnce(
          new Error('mocked error')
        )

        await ConfigurationsController.update(request, response)

        expect(response.status).toHaveBeenCalledWith(422)
        expect(response.json).toHaveBeenCalledWith({
          error: 'mocked error',
        })
      })
    })
  })

  describe(ConfigurationsController.index, () => {
    const params = { uid: 'owl' }

    describe('When successful', () => {
      it('returns a status of 200 and an array of configurations', async () => {
        const request = createRequestWithUser(params)
        const response = createResponse()
        const configurationList = [
          createConfiguration(),
          createConfiguration({ _id: '2', owner: 'eagle' }),
        ]

        request.app.locals.appDb.aggregate.mockImplementationOnce(() => ({
          toArray: () => configurationList,
        }))

        await ConfigurationsController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: configurationList,
        })
      })
    })

    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const request = createRequestWithUser(params)
        const response = createResponse()

        request.app.locals.appDb.toArray.mockRejectedValueOnce(
          new Error('aggregation result error')
        )

        await ConfigurationsController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'aggregation result error',
        })
      })
    })
  })

  describe(ConfigurationsController.destroy, () => {
    const params = { config_id: 'matrix-config' }

    describe('When successful', () => {
      it('returns a status of 200 and a json with a data property', async () => {
        const request = createRequestWithUser(params)
        const response = createResponse()

        request.app.locals.appDb.deleteOne.mockResolvedValueOnce({
          deletedCount: 1,
        })

        await ConfigurationsController.destroy(request, response)

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

        await ConfigurationsController.destroy(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'destroy error',
        })
      })
    })
  })
})
