import { Router } from 'express'
import * as yup from 'yup'

import AdminUsersController from '../controllers/adminController'
import studiesController from '../controllers/studiesController'
import validateRequest, { baseSchema } from '../middleware/validateRequest'
import ensureAdmin from '../utils/passport/ensure-admin'
import { v1Routes } from '../utils/routes'

const router = Router()
const uid = yup.string().required()
const body = yup.object({
  access: yup.array().of(yup.string()),
  blocked: yup.boolean(),
  account_expires: yup.string(),
  uid: yup.string(),
  company: yup.string(),
  department: yup.string(),
  display_name: yup.string(),
  icon: yup.string(),
  mail: yup.string(),
  role: yup.string(),
  title: yup.string(),
  reset_key: yup.string(),
  preferences: yup.object(),
})

const patchSchema = baseSchema({
  params: yup.object({ uid }),
  body,
})
const params = baseSchema({
  params: yup.object({ uid }),
})

router
  .route(v1Routes.admin.users.show)
  .patch(validateRequest(patchSchema), ensureAdmin, AdminUsersController.update)
  .delete(validateRequest(params), ensureAdmin, AdminUsersController.destroy)

router
  .route(v1Routes.admin.studies.index)
  .get(ensureAdmin, studiesController.index)

export default router
