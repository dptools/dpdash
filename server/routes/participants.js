import { Router } from 'express'
import { v1Routes } from '../utils/routes'
import ensureAuthenticated from '../utils/passport/ensure-authenticated'
import ParticipantsController from '../controllers/participantsController'

const router = Router()

router
  .route(v1Routes.participants.index)
  .get(ensureAuthenticated, ParticipantsController.index)

export default router
