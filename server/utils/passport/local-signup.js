import passport from 'passport'
import moment from 'moment'

import { hash } from '../crypto/hash'

import UserModel from '../../models/UserModel'
import ConfigModel from '../../models/ConfigModel'
import RegistrationMailer from '../../mailer/RegistrationMailer'

export default (req, res, next) => {
  passport.authenticate(
    'local-signup',
    { session: true },
    async function (err, existingUser, reqBody) {
      try {
        if (err) return res.status(500).json({ error: err.message })

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
        return res.status(401).json({ error: error.message })
      }
    }
  )(req, res, next)
}
