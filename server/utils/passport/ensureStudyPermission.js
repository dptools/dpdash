import UserModel from '../../models/UserModel'

export default async function ensureStudyPermission(req, res, next) {
  if (!req.isAuthenticated())
    return res.status(401).json({ error: 'Unauthorized' })

  try {
    const { study } = req.params
    const { appDb } = req.app.locals
    const user = await UserModel.findOne(appDb, { uid: req.user })
    const { blocked, access } = user
    const isStudyInAccess = access.includes(study)

    if (!isStudyInAccess) return res.status(401).json({ error: 'Unauthorized' })

    if (blocked) return res.status(403).json({ error: 'Forbidden' })

    return next()
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}
