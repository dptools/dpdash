import { Router } from 'express'
import * as yup from 'yup'

import ensureUser from '../utils/passport/ensure-user'
import ConfigurationsController from '../controllers/configurationsController'
import { v1Routes } from '../utils/routes'
import validateRequest, { baseSchema } from '../middleware/validateRequest'

const router = Router()

const body = yup.object({
  name: yup.string().required(),
  type: yup.string().required(),
  readers: yup.array().of(yup.string()),
  public: yup.boolean(),
  owner: yup.string().required(),
  config: yup.object({
    ['0']: yup.array().of(
      yup.object({
        category: yup.string(),
        analysis: yup.string(),
        variable: yup.string(),
        label: yup.string(),
        color: yup.array().of(yup.string()),
        range: yup.array().of(yup.string()),
        text: yup.boolean(),
      })
    ),
  }),
})
const params = yup.object({
  config_id: yup.string().required(),
})
const allSchema = baseSchema({
  params: yup.object({
    uid: yup.string().required(),
  }),
})
const configurationSchema = baseSchema({ body })
const paramsSchema = baseSchema({ params })
const updateSchema = baseSchema({
  params,
  body,
})
router
  .route(v1Routes.config.index)
  .get(validateRequest(allSchema), ensureUser, ConfigurationsController.index)
  .post(
    validateRequest(configurationSchema),
    ensureUser,
    ConfigurationsController.create
  )

router
  .route(v1Routes.config.show)
  .get(
    validateRequest(paramsSchema),
    ensureUser,
    ConfigurationsController.findOne
  )
  .delete(
    validateRequest(paramsSchema),
    ensureUser,
    ConfigurationsController.destroy
  )
  .patch(
    validateRequest(updateSchema),
    ensureUser,
    ConfigurationsController.update
  )

export default router
