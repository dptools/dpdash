import passport from 'passport'
import moment from 'moment'

import { hash } from '../crypto/hash'

import UserModel from '../../models/UserModel'
import ConfigModel from '../../models/ConfigModel'

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
        const display_name = reqBody.display_name
        const hashedPW = hash(password)
        const account_expires = moment().add(1, 'years').format()
        const configAttributes = { owner: uid, readers: [uid] }
        const newUserAttributes = {
          uid,
          display_name,
          password: hashedPW,
          mail: email,
          account_expires,
          preferences: {},
        }
        const newUser = await UserModel.save(appDb, newUserAttributes)

        await ConfigModel.save(appDb, configAttributes)

        return res.status(200).json({ data: newUser })
      } catch (error) {
        return res.status(401).json({ error: error.message })
      }
    }
  )(req, res, next)
}
