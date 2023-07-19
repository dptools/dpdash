import { Router } from 'express'

import ensureUser from '../utils/passport/ensure-user'
import ConfigurationsController from '../controllers/configurationsController'
import { v1Routes } from '../utils/routes'

const router = Router()

router
  .route(v1Routes.config.index)
  .get(ensureUser, ConfigurationsController.index)
  .post(ensureUser, ConfigurationsController.create)

router
  .route(v1Routes.config.show)
  .get(ensureUser, ConfigurationsController.findOne)
  .delete(ensureUser, ConfigurationsController.destroy)
  .patch(ensureUser, ConfigurationsController.update)

export default router
