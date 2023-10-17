import passport from 'passport'

import { verifyHash } from '../crypto/hash'
import { isAccountExpired } from './helpers'

import ConfigModel from '../../models/ConfigModel'
import UserModel from '../../models/UserModel'

export default (req, res, _, user) => {
  //validate submitted password
  if (!verifyHash(req.body.password, user.password))
    return res.status(401).json({ error: 'Incorrect password' })

  //passport local log-in serializer
  passport.serializeUser(function (user, done) {
    done(null, user.uid)
  })
  passport.deserializeUser(function (user, done) {
    done(null, user)
  })
  //If the user exists, serialize the user to the session
  req.login(user, async function (err) {
    if (err) return res.status(500).json({ error: err.message })

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

      if (isAccountExpired(account_expires, role)) {
        await req.session.destroy()
        await req.logout()

        res.clearCookie('connect.sid')

        return res.status(401).json({ error: 'Account is expired' })
      }
      req.session.role = role
      req.session.display_name = display_name
      req.session.mail = mail
      req.session.celery_tasks = []
      req.session.icon = icon
      req.session.userAccess = access

      return res.status(200).json({ data: userInfo })
    } catch (error) {
      console.error(error)
      return res.status(400).json({ error: error.message })
    }
  })
}
