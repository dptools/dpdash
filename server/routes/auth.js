import { Router } from 'express'
import * as yup from 'yup'

import { v1Routes } from '../utils/routes'
import ensureAuthenticated from '../utils/passport/ensure-authenticated'
import AuthController from '../controllers/authController'
import validateRequest, { baseSchema } from '../middleware/validateRequest'

const router = Router()

const signUpSchema = baseSchema({
  body: yup.object({
    username: yup.string().required(),
    password: yup.string().min(8).required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'passwords do not match'),
    fullName: yup.string().required(),
    mail: yup.string().email().required(),
  }),
})

const signInSchema = baseSchema({
  body: yup.object({
    username: yup.string().required(),
    password: yup.string().min(8).required(),
  }),
})

router
  .route(v1Routes.auth.login)
  .post(validateRequest(signInSchema), AuthController.authenticate)

router
  .route(v1Routes.auth.signup)
  .post(validateRequest(signUpSchema), AuthController.create)

router
  .route(v1Routes.auth.logout)
  .get(ensureAuthenticated, AuthController.destroy)

router.route(v1Routes.auth.me).get(ensureAuthenticated, AuthController.show)

router.route(v1Routes.auth.resetpw).post(AuthController.update)

export default router
