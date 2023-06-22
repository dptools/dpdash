import UserModel from '../../models/UserModel'
import { isAccountExpired } from './helpers'

export default async function ensureAuthenticated(req, res, next) {
  try {
    if (!req.isAuthenticated())
      return res.status(401).json({ error: 'Please login' })

    const { appDb } = req.app.locals
    const uid = req.user
    const user = await UserModel.findOne(appDb, uid)
    const { account_expires, blocked, access } = user

    switch (true) {
      case isAccountExpired(account_expires):
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
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
