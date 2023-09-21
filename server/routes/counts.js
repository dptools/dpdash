import { Router } from 'express'
import ensureAuthenticated from '../utils/passport/ensure-authenticated'
import CountsController from '../controllers/countsController'
import { v1Routes } from '../utils/routes'

const router = Router()

router
  .route(v1Routes.counts.index)
  .get(ensureAuthenticated, CountsController.index)

export default router
