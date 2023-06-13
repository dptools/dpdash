import ConfigModel from '../../models/ConfigModel'

const ConfigurationsController = {
  create: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { insertedId, insertedCount } = await ConfigModel.save(
        appDb,
        req.body
      )

      if (insertedCount > 0) {
        const newConfiguration = await ConfigModel.findOne(appDb, insertedId)

        return res.status(200).json({ data: newConfiguration })
      }
      if (!insertedId) return res.status(500)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
  destroy: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { config_id } = req.params
      const { deletedCount } = await ConfigModel.destroy(appDb, config_id)

      if (deletedCount > 0) {
        return res.status(200)
      } else {
        return res.status(404)
      }
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },
  update: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { config_id } = req.params
      const { value } = await ConfigModel.update(appDb, config_id, req.body)

      if (value) {
        return res.status(200).json({ data: value })
      } else return res.status(400)
    } catch (error) {
      return res.status(500).json({ error: error.message })
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
