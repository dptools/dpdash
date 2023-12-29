import http from '../../http'
import { apiRoutes } from '../../../routes/routes'

const chart = {
  create: async (chartAttributes) =>
    http.post(apiRoutes.chart.index, chartAttributes),
  destroy: async (chart_id) => http.delete(apiRoutes.chart.show(chart_id)),
  all: async (queryParams) => http.get(apiRoutes.chart.index, queryParams),
  update: async (chart_id, chartAttributes) =>
    http.patch(apiRoutes.chart.show(chart_id), chartAttributes),
  show: async (chart_id) => http.get(apiRoutes.chart.show(chart_id)),
}

export default chart
