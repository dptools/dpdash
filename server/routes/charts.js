import { Router } from 'express'
import * as yup from 'yup'

import ensureAuthenticated from '../utils/passport/ensure-authenticated'
import { v1Routes } from '../utils/routes'
import chartsDataController from '../controllers/chartsDataController'
import chartsController from '../controllers/chartsController'
import chartsDuplicateController from '../controllers/chartsDuplicateController'
import chartsShareController from '../controllers/chartsShareController'
import validateRequest, { baseSchema } from '../middleware/validateRequest'

const router = Router()
const chartsIndexSchema = baseSchema({
  query: yup.object({
    search: yup.string(),
  }),
})

router
  .route(v1Routes.chartsData.show)
  .get(ensureAuthenticated, chartsDataController.show)

router
  .route(v1Routes.charts.index)
  .post(ensureAuthenticated, chartsController.create)
  .get(
    validateRequest(chartsIndexSchema),
    ensureAuthenticated,
    chartsController.index
  )

router
  .route(v1Routes.charts.show)
  .delete(ensureAuthenticated, chartsController.destroy)
  .get(ensureAuthenticated, chartsController.show)
  .patch(ensureAuthenticated, chartsController.update)

router
  .route(v1Routes.chartsDuplicate.index)
  .post(ensureAuthenticated, chartsDuplicateController.create)

router
  .route(v1Routes.chartsShare.index)
  .post(ensureAuthenticated, chartsShareController.create)

export default router
