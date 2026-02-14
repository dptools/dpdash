import { Router } from 'express'

import DashboardsController from '../controllers/dashboardController'
import ensureStudyPermission from '../utils/passport/ensureStudyPermission'
import { v1Routes } from '../utils/routes'

const router = Router()

router
  .route(v1Routes.dashboards.show)
  .get(ensureStudyPermission, DashboardsController.show)

export default router
