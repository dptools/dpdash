import { apiRoutes } from '../../../routes/routes'
import http from '../../http'

const chartsData = {
  show: async (chartId, queryParams) =>
    http.get(apiRoutes.chartData.show(chartId), queryParams),
}

export default chartsData
