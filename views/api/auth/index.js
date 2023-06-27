import { BASE_REQUEST_OPTIONS } from '../../../constants'
import { apiRoutes } from '../../routes/routes'
import { handleApiResponse } from '../helpers'

const auth = {
  login: async (credentials) => {
    const response = await fetch(apiRoutes.auth.login, {
      ...BASE_REQUEST_OPTIONS,
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    return handleApiResponse(response)
  },
  logout: async () => {
    const response = await fetch(apiRoutes.auth.logout, BASE_REQUEST_OPTIONS)

    return handleApiResponse(response)
  },
  me: async () => {
    const response = await fetch(apiRoutes.auth.me, {
      ...BASE_REQUEST_OPTIONS,
    })

    return handleApiResponse(response)
  },
  resetPassword: async (resetAttributes) => {
    const response = await fetch(apiRoutes.auth.resetPassword, {
      ...BASE_REQUEST_OPTIONS,
      method: 'POST',
      body: JSON.stringify(resetAttributes),
    })

    return handleApiResponse(response)
  },
}

export default auth
