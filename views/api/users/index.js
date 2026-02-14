import { apiRoutes } from '../../routes/routes'
import http from '../http'

const users = {
  loadAll: async () => http.get(apiRoutes.users.index),
  findOne: async (userId) => http.get(apiRoutes.users.show(userId)),
  update: async (userId, userAttributes) =>
    http.patch(apiRoutes.users.show(userId), userAttributes),
}

export default users
