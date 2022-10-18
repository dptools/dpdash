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
import { routes } from '../utils/routes'
import { defaultTargetValueMap } from '../utils/defaultTargetValueMap'

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
      dataBySite,
      labels,
      studyTotals,
    } = await graphDataController(dataDb, userAccess, chart_id)
    const user = userFromRequest(req)
    const graph = {
      chart_id,
      dataBySite,
      labels,
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
      const { chart_id } = req.params
      const { dataDb } = req.app.locals
      const chart = await dataDb.collection(collections.charts).findOne({
        _id: ObjectID(chart_id),
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

      return res.status(500).send({ message: err.message })
    }
  })

router
  .route('/api/v1/charts')
  .post(ensureAuthenticated, async (req, res) => {
    try {
      const {
        fieldLabelValueMap,
        title,
        variable,
        assessment,
        description,
        public: isPublic,
      } = req.body
      const { dataDb } = req.app.locals
      const { insertedId } = await dataDb
        .collection(collections.charts)
        .insertOne({
          title,
          variable,
          assessment,
          description,
          fieldLabelValueMap,
          public: isPublic,
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
      const { dataDb, appDb } = req.app.locals
      const charts = await dataDb
        .collection(collections.charts)
        .find({
          $or: [
            { owner: req.user },
            { sharedWith: req.user },
            { public: true },
          ],
        })
        .toArray()
      const chartList = await Promise.all(
        charts.map(async (chart) => {
          const { owner } = chart
          if (owner !== req.user) {
            const chartOwner = await appDb
              .collection(collections.users)
              .findOne({ uid: owner }, { projection: { _id: 0, icon: 1 } })
            chart.icon = chartOwner.icon
            return chart
          } else return chart
        })
      )
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
      const chart = await dataDb
        .collection(collections.charts)
        .findOne({ _id: new ObjectID(chart_id) })

      if (chart.owner !== req.user) {
        return res
          .status(422)
          .json({ message: 'Only the owner can delete a chart' })
      }

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
          { _id: new ObjectID(req.params.chart_id), owner: req.user },
          { projection: { _id: 0 } }
        )

      if (!chart) return res.redirect(routes.charts)

      const { userAccess } = req.session
      const targetValuesMap = defaultTargetValueMap(userAccess)
      chart.fieldLabelValueMap = chart.fieldLabelValueMap.map((fieldValue) => {
        const updateTargetValues = {
          ...targetValuesMap,
          ...fieldValue.targetValues,
        }
        fieldValue.targetValues = updateTargetValues
        return fieldValue
      })

      return res.status(200).json({ data: chart })
    } catch (error) {
      console.error(error)

      return res.status(500).json({ message: error.message })
    }
  })
  .patch(ensureAuthenticated, async (req, res) => {
    try {
      const { dataDb } = req.app.locals
      const { chart_id } = req.params
      const {
        title,
        variable,
        assessment,
        description,
        fieldLabelValueMap,
        public: isPublic,
      } = req.body
      const { result } = await dataDb.collection(collections.charts).updateOne(
        { _id: new ObjectID(chart_id) },
        {
          $set: {
            title,
            variable,
            assessment,
            description,
            fieldLabelValueMap,
            public: isPublic,
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
          title: `${sourceChart.title} (copy)`,
          owner: req.user,
          sharedWith: [],
        })

      return res.status(200).json({ data: insertedId })
    } catch (error) {
      return res.status(404).json({ message: 'Chart was not duplicated' })
    }
  })

router
  .route('/api/v1/charts/:chart_id/share')
  .post(ensureAuthenticated, async (req, res) => {
    try {
      const { chart_id } = req.params
      const { dataDb } = req.app.locals
      const { sharedWith } = req.body
      const { result } = await dataDb.collection(collections.charts).updateOne(
        { _id: new ObjectID(chart_id) },
        {
          $set: {
            sharedWith,
            updatedAt: new Date().toISOString(),
          },
        }
      )

      return result.ok === 1
        ? res.status(200).json({ data: result })
        : res.status(404).json({ message: 'Chart could not be shared' })
    } catch (error) {
      return res.status(404).json({ message: 'Chart could not be shared' })
    }
  })

export default router
