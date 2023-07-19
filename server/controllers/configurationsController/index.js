import { ObjectId } from 'mongodb'
import ConfigModel from '../../models/ConfigModel'

const ConfigurationsController = {
  create: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const newConfiguration = await ConfigModel.save(appDb, req.body)

      return res.status(200).json({ data: newConfiguration })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
  destroy: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { config_id } = req.params
      await ConfigModel.destroy(appDb, config_id)

      return res.status(204).end()
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
  findOne: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { config_id } = req.params
      const currentConfig = await ConfigModel.findOne(appDb, {
        _id: ObjectId(config_id),
      })

      return res.status(200).json({ data: currentConfig })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
  update: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { config_id } = req.params
      const updatedConfiguration = await ConfigModel.update(
        appDb,
        config_id,
        req.body
      )

      return res.status(200).json({ data: updatedConfiguration })
    } catch (error) {
      return res.status(422).json({ error: error.message })
    }
  },
  index: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { uid } = req.params
      const data = await ConfigModel.index(appDb, uid)

      return res.status(200).json({ data })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
}

export default ConfigurationsController
