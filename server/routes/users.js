import { Router } from 'express'
import * as yup from 'yup'

import ensureUser from '../utils/passport/ensure-user'
import UsersController from '../controllers/usersController'
import { v1Routes } from '../utils/routes'
import validateRequest, { baseSchema } from '../middleware/validateRequest'

const router = Router()
const patchSchema = baseSchema({
  params: yup.object({
    uid: yup.string(),
  }),
  body: yup.object({
    company: yup.string(),
    department: yup.string(),
    display_name: yup.string(),
    favoriteCharts: yup.array().of(yup.string()),
    icon: yup.string(),
    iconFileName: yup.string(),
    mail: yup.string(),
    preferences: yup.object({
      config: yup.string(),
      star: yup.object(),
      complete: yup.object(),
    }),
    title: yup.string(),
  }),
})
const getUserSchema = baseSchema({
  params: yup.object({
    uid: yup.string(),
  }),
})

router
  .route(v1Routes.users.show)
  .get(validateRequest(getUserSchema), ensureUser, UsersController.show)
  .patch(validateRequest(patchSchema), ensureUser, UsersController.edit)

export default router
