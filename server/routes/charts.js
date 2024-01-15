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
    sortBy: yup.string(),
    sortDirection: yup.string(),
  }),
})
const chartSchema = baseSchema({
  body: yup.object({
    title: yup.string().required(),
    description: yup.string().required(),
    assessment: yup.string().required(),
    variable: yup.string().required(),
    public: yup.boolean(),
    fieldLabelValueMap: yup.array().of(
      yup.object({
        value: yup.string(),
        label: yup.string(),
        color: yup.string(),
        targetValues: yup.object(),
      })
    ),
  }),
})
const destroyChartSchema = baseSchema({
  params: yup.object({
    uid: yup.string().required(),
  }),
})
const duplicateChartSchema = baseSchema({
  body: yup.object({
    chart_id: yup.string().required(),
  }),
})
const shareChartSchema = baseSchema({
  body: yup.object({
    sharedWith: yup.array().of(yup.string()).required(),
  }),
  params: yup.object({
    chart_id: yup.string().required(),
  }),
})
const editChartSchema = baseSchema({
  params: yup.object({
    chart_id: yup.string().required(),
  }),
})
const nameValueSchema = yup.object({ name: yup.string(), value: yup.string() })
const viewChartSchema = baseSchema({
  params: yup.object({
    chart_id: yup.string().required(),
  }),
  query: yup.object({
    chrcrit_part: yup.array().of(nameValueSchema),
    included_excluded: yup.array().of(nameValueSchema),
    sex_at_birth: yup.array().of(nameValueSchema),
    sites: yup.array().of(yup.string()),
  }),
})

router
  .route(v1Routes.chartsData.show)
  .get(
    validateRequest(viewChartSchema),
    ensureAuthenticated,
    chartsDataController.show
  )

router
  .route(v1Routes.charts.index)
  .post(
    validateRequest(chartSchema),
    ensureAuthenticated,
    chartsController.create
  )
  .get(
    validateRequest(chartsIndexSchema),
    ensureAuthenticated,
    chartsController.index
  )

router
  .route(v1Routes.charts.show)
  .delete(
    validateRequest(destroyChartSchema),
    ensureAuthenticated,
    chartsController.destroy
  )
  .get(
    validateRequest(editChartSchema),
    ensureAuthenticated,
    chartsController.show
  )
  .patch(
    validateRequest(chartSchema),
    ensureAuthenticated,
    chartsController.update
  )

router
  .route(v1Routes.chartsDuplicate.index)
  .post(
    validateRequest(duplicateChartSchema),
    ensureAuthenticated,
    chartsDuplicateController.create
  )

router
  .route(v1Routes.chartsShare.index)
  .post(
    validateRequest(shareChartSchema),
    ensureAuthenticated,
    chartsShareController.create
  )

export default router
