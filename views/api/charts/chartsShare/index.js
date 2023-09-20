import http from '../../http'
import { apiRoutes } from '../../../routes/routes'

const chartsShare = {
  create: async (chart_id, sharedWith) =>
    http.post(apiRoutes.shareChart.show(chart_id), { sharedWith }),
}

export default chartsShare
