import { Router } from 'express'

import ensureAdmin from '../utils/passport/ensure-admin'
import AdminUsersController from '../controllers/adminController'
import { v1Routes } from '../utils/routes'
import StudiesController from '../controllers/studiesController'

const router = Router()

router
  .route(v1Routes.admin.users.show)
  .patch(ensureAdmin, AdminUsersController.update)
  .delete(ensureAdmin, AdminUsersController.destroy)

router
  .route(v1Routes.admin.studies.index)
  .get(ensureAdmin, StudiesController.index)

export default router
