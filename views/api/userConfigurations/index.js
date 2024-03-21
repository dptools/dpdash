import { apiRoutes } from '../../routes/routes'
import http from '../http'

const userConfigurations = {
  all: async (userId) =>
    http.get(apiRoutes.configurations.userConfigurations(userId)),
  create: async (userId, configAttributes) =>
    http.post(
      apiRoutes.configurations.userConfigurations(userId),
      configAttributes
    ),
  destroy: async (userId, configId) =>
    http.delete(apiRoutes.configurations.userConfiguration(userId, configId)),
  findOne: async (userId, configId) =>
    http.get(apiRoutes.configurations.userConfiguration(userId, configId)),
  update: async (userId, configId, configAttributes) =>
    http.patch(
      apiRoutes.configurations.userConfiguration(userId, configId),
      configAttributes
    ),
}

export default userConfigurations
