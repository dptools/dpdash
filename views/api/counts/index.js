import { apiRoutes } from '../../routes/routes'
import http from '../http'

const counts = {
  all: async () => http.get(apiRoutes.counts.index),
}

export default counts
