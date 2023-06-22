import { Router } from 'express'

import ensureUser from '../utils/passport/ensure-user'
import UsersController from '../controllers/usersController'
import { v1Routes } from '../utils/routes'

const router = Router()

router
  .route(v1Routes.users.show)
  .get(ensureUser, UsersController.show)
  .patch(ensureUser, UsersController.edit)

export default router
