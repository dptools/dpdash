import { apiRoutes } from '../../../routes/routes'
import http from '../../http'

const users = {
  update: async (userId, userAttributes) =>
    http.patch(apiRoutes.admin.users.show(userId), userAttributes),
}

export default users
