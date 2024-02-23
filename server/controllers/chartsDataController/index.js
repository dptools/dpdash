import { ObjectId } from 'mongodb'
import qs from 'qs'

import { collections } from '../../utils/mongoCollections'
import BarChartService from '../../services/BarChartService'
import BarChartTableService from '../../services/BarChartTableService'
import CsvService from '../../services/CSVService'
import StudiesModel from '../../models/StudiesModel'
import FiltersService from '../../services/FiltersService'
import UserModel from '../../models/UserModel'

const show = async (req, res, next) => {
  try {
    const { appDb } = req.app.locals
    const user = await UserModel.findOne(appDb, { uid: req.user.uid })
    const userSites = StudiesModel.sanitizeAndSort(user.access)
    const { chart_id } = req.params
    const parsedQueryParams = qs.parse(req.query)
    const filtersService = new FiltersService(
      parsedQueryParams.filters,
      userSites
    )
    const filters = filtersService.filters
    const chart = await appDb.collection(collections.charts).findOne({
      _id: new ObjectId(chart_id),
    })
    const chartService = new BarChartService(appDb, chart, filtersService)
    const { processedDataBySite, studyTotals, labelMap } =
      await chartService.createChart()

    const dataBySite =
      processedDataBySite.size > 0
        ? Array.from(processedDataBySite.values())
        : []
    const labels = Array.from(labelMap.values())
    const chartTableService = new BarChartTableService(dataBySite, labels)
    const websiteTable = chartTableService.websiteTableData()
    const chartOwner = await appDb.collection(collections.users).findOne(
      { uid: chart.owner },
      {
        projection: {
          _id: 0,
          display_name: 1,
          icon: 1,
          uid: 1,
        },
      }
    )

    if (req.headers['content-type'] === 'text/csv') {
      res.header('Content-Type', 'text/csv')

      const csvTableData = chartTableService.csvTableData()
      const csvService = new CsvService(csvTableData)
      const csvStream = csvService.toReadableStream().pipe(res)
      csvStream.on('error', (err) => next(err))
      csvStream.on('end', () => res.end())

      return res.send()
    }

    const graph = {
      chart_id,
      dataBySite,
      labels,
      title: chart.title,
      description: chart.description,
      legend: chartService.legend(),
      studyTotals,
      filters,
      chartOwner,
      graphTable: websiteTable,
      userSites,
    }
    return res.status(200).json({ data: graph })
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
}

export default {
  show,
}
