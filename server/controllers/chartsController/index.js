import { ObjectId } from 'mongodb'
import ChartsModel from '../../models/ChartsModel'
import UserModel, { userMongoProjection } from '../../models/UserModel'
import { defaultTargetValueMap } from '../../utils/defaultTargetValueMap'

const chartsController = {
  create: async (req, res) => {
    try {
      const {
        fieldLabelValueMap,
        title,
        variable,
        assessment,
        description,
        public: isPublic,
      } = req.body
      const { appDb } = req.app.locals

      const { insertedId } = await ChartsModel.create(appDb, {
        title,
        variable,
        assessment,
        description,
        fieldLabelValueMap,
        public: isPublic,
        owner: req.user.uid,
      })

      return res.status(200).json({ data: { chart_id: insertedId } })
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  },
  index: async (req, res) => {
    try {
      const chartList = []
      const { appDb } = req.app.locals
      const parsedQueryParams = Object.keys(req.query).length
        ? req.query
        : undefined

      const currentUser = await UserModel.findOne(appDb, { uid: req.user.uid })
      const chartListCursor = await ChartsModel.all(
        appDb,
        currentUser,
        parsedQueryParams
      )

      while (await chartListCursor.hasNext()) {
        const chart = await chartListCursor.next()

        chart.chartOwner = await UserModel.findOne(
          appDb,
          { uid: chart.owner },
          { ...userMongoProjection, icon: 0 }
        )

        chartList.push(chart)
      }

      return res.status(200).json({ data: chartList })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
  destroy: async (req, res) => {
    try {
      const { chart_id } = req.params
      const { appDb } = req.app.locals
      const { owner } = await ChartsModel.show(appDb, {
        _id: new ObjectId(chart_id),
      })

      if (owner !== req.user.uid)
        return res
          .status(422)
          .json({ message: 'Only the owner can delete a chart' })

      await ChartsModel.destroy(appDb, chart_id)

      return res.status(204).end()
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
  show: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { chart_id } = req.params
      const { access } = req.user
      const chart = await ChartsModel.show(appDb, {
        _id: new ObjectId(chart_id),
        owner: req.user.uid,
      })

      if (!chart) return res.status(400).json({ error: 'Chart not found.' })

      const targetValuesMap = defaultTargetValueMap(access)
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
      return res.status(400).json({ error: error.message })
    }
  },
  update: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { chart_id } = req.params
      const {
        title,
        variable,
        assessment,
        description,
        fieldLabelValueMap,
        public: isPublic,
      } = req.body
      const value = await ChartsModel.update(
        appDb,
        { _id: new ObjectId(chart_id) },
        {
          title,
          variable,
          assessment,
          description,
          fieldLabelValueMap,
          public: isPublic,
        }
      )

      return res.status(200).json({ data: value })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
}

export default chartsController
