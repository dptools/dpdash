import passport from 'passport'
import dayjs from 'dayjs'

import UserModel from '../../models/UserModel'
import ConfigModel from '../../models/ConfigModel'
import RegistrationMailer from '../../mailer/RegistrationMailer'
import { hash } from '../../utils/crypto/hash'
import { isAccountExpired } from '../../utils/passport/helpers'

const AuthController = {
  authenticate: async (req, res, next) => {
    passport.authenticate(
      'local',
      { session: true },
      async function (err, user, info) {
        if (err) {
          return next(err)
        }

        const { uid } = user

        const { appDb, dataDb } = req.app.locals

        const userInfo = await UserModel.update(appDb, dataDb, uid, {
          last_logon: Date.now(),
        })
        const { role, account_expires } = userInfo
    
        if (isAccountExpired(account_expires, role)) {
          await req.session.destroy()
          await req.logout()
  
          res.clearCookie('connect.sid')
  
          return res.status(401).json({ error: 'Account is expired' })
        }
        req.login(user, function (err) {
          if (err) {
            return next(err)
          }
          res.json({ data: userInfo })
        })
      }
    )(req, res, next)
  },
  create: async (req, res, next) => {
      const { appDb } = req.app.locals
      const info = req.body

      const existingUser = await UserModel.findOne(appDb, {
        uid: info.username,
      })
      if (existingUser)
        return res.status(400).json({ error: 'User has an account' })

      const password = info.password
      const uid = info.username
      const mail = info.mail
      const display_name = info.fullName
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
      const user = await UserModel.findOne(appDb, { uid: req.user.uid })

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
