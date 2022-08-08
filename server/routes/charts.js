import { Router } from 'express'
import { ObjectID } from 'mongodb'

import ensureAuthenticated from '../utils/passport/ensure-authenticated'
import { collections } from '../utils/mongoCollections'
import { userFromRequest } from '../utils/userFromRequestUtil'

import chartsListPage from '../templates/Chart.template'
import newChartPage from '../templates/NewChart.template'
import viewChartPage from '../templates/ViewChart.template'
import editChartPage from '../templates/EditChart.template'

import { legend } from '../helpers/chartsHelpers'
import { graphDataController } from '../controllers/chartsController'

const router = Router()

router.route('/charts').get(ensureAuthenticated, async (req, res) => {
  try {
    const user = userFromRequest(req)

    return res.status(200).send(chartsListPage(user))
  } catch (err) {
    console.error(err.message)

    return res.status(500).send({ message: err.message })
  }
})

router.route('/charts/new').get(ensureAuthenticated, async (req, res) => {
  try {
    const user = userFromRequest(req)

    return res.status(200).send(newChartPage(user))
  } catch (error) {
    console.error(error.message)

    return res.status(500).send({ message: err.message })
  }
})

router.route('/charts/:chart_id').get(ensureAuthenticated, async (req, res) => {
  try {
    const { dataDb } = req.app.locals
    const { chart_id } = req.params
    const { userAccess } = req.session
    const {
      chart: { title, description, fieldLabelValueMap },
      data,
      studyTotals,
    } = await graphDataController(dataDb, userAccess, chart_id)
    const user = userFromRequest(req)
    const graph = {
      chart_id,
      data,
      title: title,
      description: description,
      legend: legend(fieldLabelValueMap),
      studyTotals,
    }

    return res.status(200).send(viewChartPage(user, graph))
  } catch (err) {
    console.error(err.stack)

    return res.status(500).send({ message: err.message })
  }
})

router
  .route('/charts/:chart_id/edit')
  .get(ensureAuthenticated, async (req, res) => {
    try {
      const user = userFromRequest(req)
      const graph = {
        chart_id: req.params.chart_id,
      }

      return res.status(200).send(editChartPage(user, graph))
    } catch (error) {
      console.error(error.message)

      return res.status(500).send({ message: err.message })
    }
  })

router
  .route('/api/v1/charts')
  .post(ensureAuthenticated, async (req, res) => {
    try {
      const { fieldLabelValueMap, title, variable, assessment, description } =
        req.body
      const { dataDb } = req.app.locals
      const { insertedId } = await dataDb
        .collection(collections.charts)
        .insertOne({
          title,
          variable,
          assessment,
          description,
          fieldLabelValueMap,
          owner: req.user,
        })

      return res.status(200).json({ data: { chart_id: insertedId } })
    } catch (error) {
      console.error(error.stack)

      return res.status(500).json({ message: error.message })
    }
  })
  .get(ensureAuthenticated, async (req, res) => {
    try {
      const { dataDb } = req.app.locals
      const chartList = await dataDb
        .collection(collections.charts)
        .find({ owner: req.user })
        .toArray()

      return res.status(200).json({ data: chartList })
    } catch (error) {
      console.error(error)

      return res.status(500).json({ message: error.message })
    }
  })

router
  .route('/api/v1/charts/:chart_id')
  .delete(ensureAuthenticated, async (req, res) => {
    try {
      const { chart_id } = req.params
      const { dataDb } = req.app.locals
      const deletedChart = await dataDb
        .collection(collections.charts)
        .deleteOne({ _id: ObjectID(chart_id) })

      if (deletedChart.deletedCount > 0) {
        return res.status(200).json({ data: deletedChart.deletedCount })
      } else {
        return res.status(400).json({ message: 'Chart information not found' })
      }
    } catch (error) {
      console.error(error)

      return res.status(500).json({ message: error.message })
    }
  })
  .get(ensureAuthenticated, async (req, res) => {
    try {
      const { dataDb } = req.app.locals
      const chart = await dataDb
        .collection(collections.charts)
        .findOne(
          { _id: new ObjectID(req.params.chart_id) },
          { projection: { _id: 0 } }
        )
      return res.status(200).json({ data: chart })
    } catch (error) {
      console.error(error)

      return res.status(500).json({ message: error.message })
    }
  })
  .put(ensureAuthenticated, async (req, res) => {
    try {
      const { dataDb } = req.app.locals
      const { chart_id } = req.params
      const { title, variable, assessment, description, fieldLabelValueMap } =
        req.body
      const { result } = await dataDb.collection(collections.charts).updateOne(
        { _id: new ObjectID(chart_id) },
        {
          $set: {
            title,
            variable,
            assessment,
            description,
            fieldLabelValueMap,
            updatedAt: new Date().toISOString(),
          },
        }
      )

      return result.ok === 1
        ? res.status(200).json({ data: result })
        : res.status(404).json({ message: 'Chart could not be updated' })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  })
router
  .route('/api/v1/charts/duplicate')
  .post(ensureAuthenticated, async (req, res) => {
    try {
      const { dataDb } = req.app.locals
      const { chart_id } = req.body
      const sourceChart = await dataDb.collection(collections.charts).findOne(
        {
          _id: new ObjectID(chart_id),
        },
        { projection: { _id: 0 } }
      )
      const { insertedId } = await dataDb
        .collection(collections.charts)
        .insertOne({
          ...sourceChart,
          title: sourceChart.title + ' Duplicate',
        })

      return res.status(200).json({ data: insertedId })
    } catch (error) {
      return res.status(404).json({ message: 'Chart was not duplicated' })
    }
  })
export default router
