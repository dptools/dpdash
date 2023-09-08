import { apiRoutes } from '../../routes/routes'
import http from '../http'

const participants = {
  all: async () => http.get(apiRoutes.participants.index),
}

export default participants
