import { Router } from 'express'

import ApiUsersController from '../controllers/apiUsersController'
import { v1Routes } from '../utils/routes'
import ensureAuthenticated from '../utils/passport/ensure-authenticated'

const router = Router()

router.get(v1Routes.users.index, ensureAuthenticated, ApiUsersController.index)

export default router
