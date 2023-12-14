import passport from 'passport'
import UserModel from '../../models/UserModel'
import ConfigModel from '../../models/ConfigModel'
import RegistrationMailer from '../../mailer/RegistrationMailer'
import { hash } from '../../utils/crypto/hash'
import moment from 'moment'

const AuthController = {
  create: async (req, res, next) => {
    passport.authenticate(
      'local-signup',
      { session: true },
      async function (err, existingUser, reqBody) {
        try {
          if (err) return res.status(400).json({ error: err.message })

          if (existingUser)
            return res.status(400).json({ error: 'User has an account' })

          const { appDb } = req.app.locals
          const password = reqBody.password
          const uid = reqBody.username
          const email = reqBody.email
          const display_name = reqBody.fullName
          const hashedPW = hash(password)
          const account_expires = moment().add(1, 'years').format()
          const configAttributes = { owner: uid, readers: [uid] }
          const configuration = await ConfigModel.save(appDb, configAttributes)
          const newUserAttributes = {
            uid,
            display_name,
            password: hashedPW,
            mail: email,
            account_expires,
            preferences: { config: configuration._id.toString() },
          }
          const newUser = await UserModel.save(appDb, newUserAttributes)
          const registrationMailer = new RegistrationMailer(newUser)

          await registrationMailer.sendMail()

          return res.status(200).json({ data: newUser })
        } catch (error) {
          return res.status(400).json({ error: error.message })
        }
      }
    )(req, res, next)
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
      const { password, confirmPassword, reset_key, username } = req.body

      if (password !== confirmPassword)
        return res.status(400).json({ error: 'passwords do not match' })

      const { appDb } = req.app.locals
      const encryptPassword = hash(password)
      const user = await UserModel.findOne(appDb, {
        uid: String(username),
        reset_key: String(reset_key),
        force_reset_pw: true,
      })

      if (!user)
        return res.status(400).json({
          error: 'User not found or there is a problem with the reset key',
        })

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
      return res.status(400).json({ error: error.message })
    }
  },
}

export default AuthController
