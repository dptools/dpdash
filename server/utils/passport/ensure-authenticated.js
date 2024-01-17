import UserModel from '../../models/UserModel'
import { isAccountExpired } from './helpers'
import { logout } from './logout'

export default async function ensureAuthenticated(req, res, next) {

  if (!req.isAuthenticated())
    return res.status(401).json({ error: 'Please login' })

  const { appDb } = req.app.locals
  req.user = await UserModel.findOne(appDb, { uid: req.user.uid })

  const { account_expires, blocked, access, role } = req.user

  switch (true) {
    case isAccountExpired(account_expires, role):
      logout(req, res, next)

      return res.status(401).json({ error: 'Account is expired' })

    case !!blocked:
      return res
        .status(403)
        .json({ error: 'Account is blocked, please contact your admin' })
    case access.length === 0:
      return res.status(403).json({ error: 'Forbidden.' })
    default:
      return next()
  }
}
