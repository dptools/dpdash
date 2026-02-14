import { apiRoutes } from '../../../routes/routes'
import http from '../../http'

const chartsShare = {
  create: async (chart_id, sharedWith) =>
    http.post(apiRoutes.shareChart.show(chart_id), { sharedWith }),
}

export default chartsShare
