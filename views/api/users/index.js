import { BASE_REQUEST_OPTIONS } from '../../../constants'
import { apiRoutes } from '../../routes/routes'
import { handleApiResponse } from '../helpers'

const users = {
  findOne: async (userId) => {
    const response = await fetch(apiRoutes.users.user(userId), {
      ...BASE_REQUEST_OPTIONS,
    })

    return handleApiResponse(response)
  },
  update: async (userId, userAttributes) => {
    const response = await fetch(apiRoutes.users.user(userId), {
      ...BASE_REQUEST_OPTIONS,
      method: 'PATCH',
      body: JSON.stringify(userAttributes),
    })

    return handleApiResponse(response)
  },
}

export default users
