import { apiRoutes } from '../../routes/routes'
import http from '../http'

const participants = {
  all: async (queryParams) =>
    http.get(apiRoutes.participants.index, queryParams),
}

export default participants
