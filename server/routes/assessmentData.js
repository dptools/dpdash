import { Router } from 'express'

import AssessmentDayDataController from '../controllers/api/assessmentDayDataController'
import { ensureApiAuthenticated } from '../utils/passport/ensure-api-authenticated'
import { v1Routes } from '../utils/routes'

const router = Router()

router
  .route(v1Routes.assessmentData.index)
  .post(ensureApiAuthenticated, AssessmentDayDataController.create)
  .delete(ensureApiAuthenticated, AssessmentDayDataController.destroy)

export default router
