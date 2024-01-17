import UserModel from '../../models/UserModel'
import { isAccountExpired } from './helpers'

export default async function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated())
    return res.status(401).json({ error: 'Please login' })

  const { account_expires, blocked, access, role } = req.user

  switch (true) {
    case isAccountExpired(account_expires, role):
      await req.session.destroy()
      await req.logout()

      res.clearCookie('connect.sid')

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
