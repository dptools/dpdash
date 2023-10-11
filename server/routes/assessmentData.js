import { Router } from 'express'
import AssessmentDayDataController from '../controllers/api/assessmentDayDataController'
import { v1Routes } from '../utils/routes'
import { ensureApiAuthenticated } from '../utils/passport/ensure-api-authenticated'

const router = Router()

router
  .route(v1Routes.assessmentData.index)
  .post(ensureApiAuthenticated, AssessmentDayDataController.create)

export default router
