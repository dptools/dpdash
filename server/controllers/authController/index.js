import passport from 'passport'
import UserModel from '../../models/UserModel'
import ConfigModel from '../../models/ConfigModel'
import RegistrationMailer from '../../mailer/RegistrationMailer'
import { hash } from '../../utils/crypto/hash'
import dayjs from 'dayjs'
import authenticate from '../../strategies/authenticate'
import { logout } from '../../utils/passport/logout'

const AuthController = {
  authenticate,
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
          const mail = reqBody.mail
          const display_name = reqBody.fullName
          const hashedPW = hash(password)
          const account_expires = dayjs().add(1, 'years').format()
          const configAttributes = ConfigModel.withDefaults({
            owner: uid,
            readers: [uid],
          })
          const configuration = await ConfigModel.create(
            appDb,
            configAttributes
          )

          const newUserAttributes = {
            uid,
            display_name,
            password: hashedPW,
            mail,
            account_expires,
            preferences: { config: configuration._id.toString() },
          }
          const newUser = await UserModel.create(appDb, newUserAttributes)
          const registrationMailer = new RegistrationMailer(newUser)

          await registrationMailer.sendMail()

          return res.status(200).json({ data: newUser })
        } catch (error) {
          return res.status(400).json({ error: error.message })
        }
      }
    )(req, res, next)
  },
  destroy: async (req, res, next) => {
    try {
      logout(req, res, next)

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

      const { appDb, dataDb } = req.app.locals
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
        dataDb,
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
