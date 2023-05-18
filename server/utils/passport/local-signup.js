import passport from 'passport'
import moment from 'moment'

import { hash } from '../crypto/hash'
import { routes } from '../routes'

import UserModel from '../../models/UserModel'
import ConfigModel from '../../models/ConfigModel'

export default (req, res, next) => {
  passport.authenticate(
    'local-signup',
    { session: true },
    async function (err, existingUser, reqBody) {
      try {
        if (err) return res.redirect(`${routes.login}?e=${err}`)

        if (existingUser) return res.redirect(`${routes.signup}?e=existingUser`)

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
        }

        await UserModel.save(appDb, newUserAttributes)
        await ConfigModel.save(appDb, configAttributes)

        return res.redirect(routes.root)
      } catch (error) {
        console.error(error)

        return res.redirect(`${routes.login}?e=${error}`)
      }
    }
  )(req, res, next)
}
