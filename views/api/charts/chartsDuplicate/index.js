import http from '../../http'
import { apiRoutes } from '../../../routes/routes'

const chartsDuplicate = {
  create: async (chart_id) =>
    http.post(apiRoutes.duplicateChart.show, { chart_id }),
}

export default chartsDuplicate
