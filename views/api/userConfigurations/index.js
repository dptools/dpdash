import { apiRoutes } from '../../routes/routes'
import { BASE_REQUEST_OPTIONS } from '../../../constants'
import { handleApiResponse } from '../helpers'

const userConfigurations = {
  all: async (userId) => {
    const response = await fetch(
      apiRoutes.configurations.userConfigurations(userId),
      BASE_REQUEST_OPTIONS
    )

    return handleApiResponse(response)
  },
  create: async (userId, configAttributes) => {
    const response = await fetch(
      apiRoutes.configurations.userConfigurations(userId),
      {
        ...BASE_REQUEST_OPTIONS,
        method: 'POST',
        body: JSON.stringify(configAttributes),
      }
    )

    return handleApiResponse(response)
  },
  destroy: async (userId, configId) => {
    const response = await fetch(
      apiRoutes.configurations.userConfiguration(userId, configId),
      {
        ...BASE_REQUEST_OPTIONS,
        method: 'DELETE',
      }
    )

    return handleApiResponse(response)
  },
  update: async (userId, configId, configAttributes) => {
    const response = await fetch(
      apiRoutes.configurations.userConfiguration(userId, configId),
      {
        ...BASE_REQUEST_OPTIONS,
        method: 'PATCH',
        body: JSON.stringify(configAttributes),
      }
    )

    return handleApiResponse(response)
  },
}

export default userConfigurations
