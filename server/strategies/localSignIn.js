import UserModel from '../models/UserModel'
import { verifyHash } from '../utils/crypto/hash'

export default async function (req, username, password, done) {
  try {
    const { appDb } = req.app.locals
    const userAttributes = { uid: username }
    const user = await UserModel.findOne(appDb, userAttributes, {
      password: 1,
      role: 1,
      display_name: 1,
      mail: 1,
      icon: 1,
      access: 1,
      account_expires: 1,
      uid: 1,
    })
    if (!verifyHash(password, user?.password))
      return res.status(400).json({ error: 'Incorrect password' })

    delete user?.password

    return !user ? done(null, false) : done(null, user)
  } catch (error) {
    return done(error)
  }
}
