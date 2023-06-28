import { apiRoutes } from '../../routes/routes'
import http from '../http'

const auth = {
  login: async (credentials) => http.post(apiRoutes.auth.login, credentials),
  logout: async () => http.get(apiRoutes.auth.logout),
  me: async () => http.get(apiRoutes.auth.me),
  resetPassword: async (resetAttributes) =>
    http.post(apiRoutes.auth.resetPassword, resetAttributes),
}

export default auth
