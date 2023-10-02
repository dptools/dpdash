import { Router } from 'express'

import { getConfigSchema } from '../utils/routerUtil'

import ensureUser from '../utils/passport/ensure-user'

import ApiUsersController from '../controllers/apiUsersController'
import { v1Routes } from '../utils/routes'
import ensureAuthenticated from '../utils/passport/ensure-authenticated'

const router = Router()

router.get(v1Routes.users.index, ensureAuthenticated, ApiUsersController.index)

router
  .route('/api/v1/users/:uid/config/file')
  .post(ensureUser, async function (req, res) {
    const { appDb } = req.app.locals

    if (req.body && req.body.config) {
      try {
        let data = req.body.config
        const defaultColors = [
          '#4575b4',
          '#74add1',
          '#abd9e9',
          '#e0f3f8',
          '#ffffbf',
          '#fee090',
          '#fdae61',
          '#f46d43',
          '#d73027',
        ]

        if (Array.isArray(data)) {
          data.forEach((element) => {
            if (!element.color) {
              element.color = defaultColors
            }
          })
        } else {
          return res.status(400).send()
        }

        let schema = getConfigSchema()

        const dataFitToSchema = schema.cast(data)
        if (dataFitToSchema === null) {
          return res.status(400).send()
        }

        await schema.validate(dataFitToSchema)

        const newConfig = {
          owner: req.user,
          config: { 0: dataFitToSchema },
          name: req.body.name || 'Untitled',
          type: 'matrix',
          readers: [req.user],
          created: new Date().toUTCString(),
        }
        await appDb.collection('configs').insertOne(newConfig)
        return res.status(200).send()
      } catch (err) {
        if (err.name === 'ValidationError') {
          return res.status(400).send()
        } else {
          console.log('Error occurred while uploading a configuration file.')
          console.error(err)
          return res.status(500).send()
        }
      }
    } else {
      return res.status(500).send()
    }
  })

export default router
