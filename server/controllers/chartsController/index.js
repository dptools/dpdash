import { ObjectId } from 'mongodb'
import qs from 'qs'

import { collections } from '../../utils/mongoCollections'
import { userFromRequest } from '../../utils/userFromRequestUtil'
import chartsListPage from '../../templates/Chart.template'
import newChartPage from '../../templates/NewChart.template'
import viewChartPage from '../../templates/ViewChart.template'
import editChartPage from '../../templates/EditChart.template'
import { DEFAULT_CHART_FILTERS } from '../../constants'
import SubjectModel from '../../models/SubjectModel'
import BarChartService from '../../services/BarChartService'
import BarChartTableService from '../../services/BarChartTableService'
import CsvService from '../../services/CSVService'

const index = async (req, res) => {
  try {
    const user = userFromRequest(req)

    return res.status(200).send(chartsListPage(user))
  } catch (err) {
    console.error(err.message)

    return res.status(500).send({ message: err.message })
  }
}

const newChart = async (req, res) => {
  try {
    const user = userFromRequest(req)

    return res.status(200).send(newChartPage(user))
  } catch (err) {
    console.error(err.message)

    return res.status(500).send({ message: err.message })
  }
}

const show = async (req, res, next) => {
  try {
    const { dataDb, appDb } = req.app.locals
    const { chart_id } = req.params
    const { userAccess } = req.session
    const parsedQueryParams = qs.parse(req.query)
    const filters = parsedQueryParams.filters || DEFAULT_CHART_FILTERS
    const chart = await dataDb
      .collection(collections.charts)
      .findOne({ _id: ObjectId(chart_id) })
    const subjects = await SubjectModel.allForAssessment(
      dataDb,
      chart.assessment,
      userAccess,
      filters
    )
    const chartService = new BarChartService(dataDb, chart)
    const { dataBySite, labels, studyTotals } = await chartService.createChart(
      subjects,
      userAccess
    )
    const chartTableService = new BarChartTableService(dataBySite, labels)
    const websiteTable = chartTableService.websiteTableData()
    const user = userFromRequest(req)
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
    }
    return res.status(200).send(viewChartPage(user, graph))
  } catch (err) {
    console.error(err.stack)

    return res.status(500).send({ message: err.message })
  }
}

const edit = async (req, res) => {
  try {
    const { chart_id } = req.params
    const { dataDb } = req.app.locals
    const chart = await dataDb.collection(collections.charts).findOne({
      _id: ObjectId(chart_id),
      owner: req.user,
    })

    if (!chart) return res.redirect(routes.charts)

    const user = userFromRequest(req)
    const graph = {
      chart_id,
    }

    return res.status(200).send(editChartPage(user, graph))
  } catch (error) {
    console.error(error.message)

    return res.status(500).send({ message: error.message })
  }
}

export default {
  edit,
  index,
  new: newChart,
  show,
}
