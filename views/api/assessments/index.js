import { apiRoutes } from '../../routes/routes'
import http from '../http'

const assessments = {
  loadAll: async (queryParams) =>
    http.get(apiRoutes.assessments.index, queryParams),
}

export default assessments
