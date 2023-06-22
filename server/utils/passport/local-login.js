import passport from 'passport'
import moment from 'moment'

import { verifyHash } from '../crypto/hash'
import { routes } from '../routes'

import ConfigModel from '../../models/ConfigModel'
import UserModel from '../../models/UserModel'

export default (req, res, next, user) => {
  //validate submitted password
  if (!verifyHash(req.body.password, user.password))
    return res.redirect(`${routes.login}?e=forbidden`)

  //passport local log-in serializer
  passport.serializeUser(function (user, done) {
    done(null, user.uid)
  })
  passport.deserializeUser(function (user, done) {
    done(null, user)
  })
  //If the user exists, serialize the user to the session
  req.login(user, async function (err) {
    if (err) return res.redirect(`${routes.login}?e=${err}`)

    try {
      const { appDb } = req.app.locals
      const uid = user.uid
      const configQuery = { owner: uid }
      const config = await ConfigModel.findOne(appDb, configQuery)

      if (!config) {
        const configAttributes = { owner: uid, readers: [uid] }

        await ConfigModel.save(appDb, configAttributes)
      }

      const userInfo = await UserModel.update(appDb, uid, {
        last_logon: Date.now(),
      })
      const { role, display_name, mail, icon, access, account_expires } =
        userInfo
      const today = moment()
      const accountExpirationToMoment = moment(account_expires)
      const isAccountExpired = accountExpirationToMoment.isBefore(today)

      if (isAccountExpired) return res.redirect(`${routes.login}?e=forbidden`)

      req.session.role = role
      req.session.display_name = display_name
      req.session.mail = mail
      req.session.celery_tasks = []
      req.session.icon = icon
      req.session.userAccess = access

      return res.redirect(routes.root)
    } catch (error) {
      return res.redirect(`${routes.login}?e=${error}`)
    }
  })
}
