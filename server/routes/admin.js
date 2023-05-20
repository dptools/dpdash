import { Router } from 'express'

import ensureAdmin from '../utils/passport/ensure-admin'
import AdminUsersController from '../controllers/adminController'
import { v1Routes } from '../utils/routes'

const router = Router()

router
  .route(v1Routes.adminRoutes.updateUser)
  .patch(ensureAdmin, AdminUsersController.update)

export default router
