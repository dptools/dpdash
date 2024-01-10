import UserModel from '../models/UserModel'

export default async function (req, username, _password, done) {
  try {
    const { appDb } = req.app.locals
    const { mail } = req.body
    const userAttributes = { $or: [{ uid: username }, { mail }] }
    const user = await UserModel.findOne(appDb, userAttributes)

    return !user ? done(null, false, req.body) : done(null, true, null)
  } catch (error) {
    return done(error)
  }
}
