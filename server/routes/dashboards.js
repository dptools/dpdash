import { Router } from 'express'
import { v1Routes } from '../utils/routes'
import ensureStudyPermission from '../utils/passport/ensureStudyPermission'
import DashboardsController from '../controllers/dashboardController'

const router = Router()

router
  .route(v1Routes.dashboards.show)
  .get(ensureStudyPermission, DashboardsController.show)

export default router
