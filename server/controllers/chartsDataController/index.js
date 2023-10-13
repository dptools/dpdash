import { ObjectId } from 'mongodb'
import qs from 'qs'

import { collections } from '../../utils/mongoCollections'
import SubjectModel from '../../models/SubjectModel'
import BarChartService from '../../services/BarChartService'
import BarChartTableService from '../../services/BarChartTableService'
import CsvService from '../../services/CSVService'
import StudiesModel from '../../models/StudiesModel'
import FiltersService from '../../services/FiltersService'

const show = async (req, res, next) => {
  try {
    const { dataDb, appDb } = req.app.locals
    const userSites = StudiesModel.sanitizeAndSort(req.session.userAccess)
    const { chart_id } = req.params
    const parsedQueryParams = qs.parse(req.query)
    const filtersService = new FiltersService(
      parsedQueryParams.filters,
      userSites
    )
    const chart = await dataDb
      .collection(collections.charts)
      .findOne({ _id: ObjectId(chart_id) })
    const chartService = new BarChartService(dataDb, chart)
    const filters = filtersService.filters
    const subjects = await SubjectModel.allForAssessment(
      dataDb,
      chart.assessment,
      filtersService
    )
    const { dataBySite, labels, studyTotals } = await chartService.createChart(
      subjects,
      filters.sites
    )
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
    console.error(err.stack)

    return res.status(500).send({ message: err.message })
  }
}

export default {
  show,
}
