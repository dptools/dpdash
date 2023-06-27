import { Router } from 'express'
import passport from 'passport'

import LocalLogin from '../utils/passport/local-login'
import { v1Routes } from '../utils/routes'
import ensureAuthenticated from '../utils/passport/ensure-authenticated'
import AuthController from '../controllers/authController'

const router = Router()

router.route(v1Routes.auth.login).post(function (req, res, next) {
  passport.authenticate('local-login', { session: true }, function (err, user) {
    if (err) return res.status(400).json({ error: err.message })

    return LocalLogin(req, res, next, user)
  })(req, res, next)
})

router
  .route(v1Routes.auth.logout)
  .get(ensureAuthenticated, AuthController.destroy)

router.route(v1Routes.auth.me).get(ensureAuthenticated, AuthController.show)

export default router
