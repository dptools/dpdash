import { Router } from 'express'

import ApiUsersController from '../controllers/apiUsersController'
import ensureAuthenticated from '../utils/passport/ensure-authenticated'
import { v1Routes } from '../utils/routes'

const router = Router()

router.get(v1Routes.users.index, ensureAuthenticated, ApiUsersController.index)

export default router
