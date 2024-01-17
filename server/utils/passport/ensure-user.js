import UserModel from '../../models/UserModel'

export default async function ensureUser(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unathorized' })
  }

  const { appDb } = req.app.locals
  req.user = await UserModel.findOne(appDb, { uid: req.user.uid })

  if (req.params.uid !== req.user.uid) {
    return res.status(400).json({ error: 'Bad Request' })
  } else {
    return next()
  }
}
