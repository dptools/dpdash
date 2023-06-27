import LocalSignup from '../../utils/passport/local-signup'
import UserModel from '../../models/UserModel'
import { hash } from '../../utils/crypto/hash'

const AuthController = {
  create: async (req, res, next) => {
    return LocalSignup(req, res, next)
  },
  destroy: async (req, res) => {
    try {
      await req.session.destroy()
      await req.logout()

      res.clearCookie('connect.sid')

      return res.status(200).json({ data: { message: 'User is logged out' } })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  },
  show: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const user = await UserModel.findOne(appDb, { uid: req.user })

      return res.status(200).json({ data: user })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
  update: async (req, res) => {
    try {
      const { password, confirmpw, reset_key, username } = req.body

      if (password !== confirmpw)
        return res.status(400).json({ error: 'passwords do not match' })

      const { appDb } = req.app.locals
      const encryptPassword = hash(password)
      const user = await UserModel.findOne(appDb, {
        uid: username,
        reset_key,
      })

      if (!user) return res.status(400).json({ error: 'User not found' })

      const userAttributes = {
        password: encryptPassword,
        reset_key: '',
        force_reset_pw: false,
      }
      const updatedUser = await UserModel.update(
        appDb,
        username,
        userAttributes
      )

      return res.status(200).json({ data: updatedUser })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  },
}

export default AuthController
