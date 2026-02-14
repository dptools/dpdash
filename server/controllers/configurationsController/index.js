import { ObjectId } from 'mongodb'

import ConfigModel from '../../models/ConfigModel'
import UserModel from '../../models/UserModel'

const ConfigurationsController = {
  create: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const newConfiguration = await ConfigModel.create(appDb, {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

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
        _id: new ObjectId(config_id),
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
      const updatedConfiguration = await ConfigModel.update(appDb, config_id, {
        ...req.body,
        updatedAt: new Date(),
      })

      return res.status(200).json({ data: updatedConfiguration })
    } catch (error) {
      return res.status(422).json({ error: error.message })
    }
  },
  index: async (req, res) => {
    const cachedUsers = new Map()
    const dataSet = []
    const { appDb } = req.app.locals
    const { uid } = req.params
    const isActive =
      Object.hasOwn(req.query, 'status') && req.query.status === 'active'
    const streamConfigurations = isActive
      ? await ConfigModel.active(appDb, uid)
      : await ConfigModel.all(appDb, uid)

    streamConfigurations.on('data', async (config) => {
      streamConfigurations.pause()

      const isUserCached = cachedUsers.has(config.owner)

      if (isUserCached) {
        const configOwner = cachedUsers.get(config.owner)

        dataSet.push({ ...config, owner_display_name: configOwner })
      } else {
        const configOwner = await UserModel.findOne(
          appDb,
          { uid: config.owner },
          { display_name: 1 }
        )

        cachedUsers.set(config.owner, configOwner.display_name)
        dataSet.push({
          ...config,
          owner_display_name: configOwner.display_name,
        })
      }

      streamConfigurations.resume()
    })

    await new Promise((resolve, reject) => {
      streamConfigurations.on('end', () => resolve())

      streamConfigurations.on('error', (err) => reject(err))
    })

    return res.status(200).json({ data: dataSet })
  },
}

export default ConfigurationsController
