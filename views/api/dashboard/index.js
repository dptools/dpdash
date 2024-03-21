import { apiRoutes } from '../../routes/routes'
import http from '../http'

const dashboard = {
  load: async (study, subject) =>
    http.get(apiRoutes.dashboards.show(study, subject)),
}

export default dashboard
