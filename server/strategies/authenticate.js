import passport from 'passport'
import { isAccountExpired } from '../utils/passport/helpers'
import UserModel from '../models/UserModel'
import ConfigModel from '../models/ConfigModel'

export default async function (req, res, next) {
  passport.authenticate(
    'local-login',
    { session: true },
    async function (err, user) {
      try {
        if (err) return res.status(400).json({ error: err.message })

        passport.serializeUser(function (user, done) {
          done(null, user.uid)
        })

        passport.deserializeUser(function (user, done) {
          done(null, user)
        })

        req.login(user, async function (err) {
          if (err) return res.status(400).json({ error: err.message })

          const { appDb, dataDb } = req.app.locals
          const uid = user.uid
          const configQuery = { owner: uid }
          const config = await ConfigModel.findOne(appDb, configQuery)

          if (!config) {
            const configAttributes = { owner: uid, readers: [uid] }

            await ConfigModel.create(appDb, configAttributes)
          }

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

          return res.status(200).json({ data: userInfo })
        })
      } catch (error) {
        console.log(error)
        return res.status(400).json({ error: 'error' })
      }
    }
  )(req, res, next)
}
