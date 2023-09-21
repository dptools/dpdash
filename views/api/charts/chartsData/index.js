import http from '../../http'
import { apiRoutes } from '../../../routes/routes'

const chartsData = {
  show: async (chartId, queryParams) =>
    http.get(apiRoutes.chartData.show(chartId), queryParams),
}

export default chartsData
