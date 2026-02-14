import { apiRoutes } from '../../../routes/routes'
import http from '../../http'

const chartsDuplicate = {
  create: async (chart_id) =>
    http.post(apiRoutes.duplicateChart.show, { chart_id }),
}

export default chartsDuplicate
