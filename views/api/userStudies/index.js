import { apiRoutes } from '../../routes/routes'
import http from '../http'

const userStudies = {
  loadAll: async (queryParams) =>
    http.get(apiRoutes.userStudies.index, queryParams),
}

export default userStudies
