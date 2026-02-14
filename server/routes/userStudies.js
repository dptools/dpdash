import { Router } from 'express'

import userStudiesController from '../controllers/userStudiesController'
import ensureAuthenticated from '../utils/passport/ensure-authenticated'
import { v1Routes } from '../utils/routes'

const router = Router()

router
  .route(v1Routes.userStudies.index)
  .get(ensureAuthenticated, userStudiesController.index)

export default router
