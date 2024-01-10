import UserModel from '../../models/UserModel'

export default async function ensureAdmin(req, res, next) {
  try {
    if (!req.isAuthenticated())
      return res.status(401).json({ error: 'Please login' })

    const { appDb } = req.app.locals
    const query = { uid: req.user, role: 'admin' }
    const user = await UserModel.findOne(appDb, query)

    if (!user) return res.status(401).json({ error: 'Incorrect access level.' })

    return next()
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }
}
