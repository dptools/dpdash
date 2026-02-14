import { Router } from 'express'
import * as yup from 'yup'

import assessmentsController from '../controllers/assessmentsController'
import validateRequest, { baseSchema } from '../middleware/validateRequest'
import ensureAuthenticated from '../utils/passport/ensure-authenticated'
import { v1Routes } from '../utils/routes'

const router = Router()

const assessmentIndexSchema = baseSchema({
  query: yup.object({ search: yup.string() }),
})

router
  .route(v1Routes.assessments.index)
  .get(
    validateRequest(assessmentIndexSchema),
    ensureAuthenticated,
    assessmentsController.index
  )

export default router
