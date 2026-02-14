import { apiRoutes } from '../../../routes/routes'
import http from '../../http'

const studies = {
  all: async () => http.get(apiRoutes.admin.studies.all),
}

export default studies
