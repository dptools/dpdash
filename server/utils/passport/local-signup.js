import passport from 'passport'
import config from '../../configs/config'
import { collections } from '../mongoCollections'
import { hash } from '../crypto/hash'
import defaultUserConfig from '../../configs/defaultUserConfig'
import basePathConfig from '../../configs/basePathConfig'

const basePath = basePathConfig || ''

export default (req, res, next) => {
  passport.authenticate(
    'local-signup',
    { session: true },
    function (err, user, reqBody) {
      if (err) {
        return res.redirect(`${basePath}/login?e=${err}`)
      }
      if (user) {
        return res.redirect(`${basePath}/signup?e=existingUser`)
      }
      const password = reqBody.password
      const username = reqBody.username
      const email = reqBody.email
      const display_name = reqBody.display_name
      const { appDb } = req.app.locals
      const hashedPW = hash(password)
      appDb.collection(collections.users).findOneAndUpdate(
        { uid: username },
        {
          $set: {
            display_name: display_name,
            title: '',
            department: '',
            company: '',
            mail: email,
            member_of: '',
            bad_pwd_count: 0,
            lockout_time: 0,
            last_logoff: Date.now(),
            last_logon: Date.now(),
            account_expires: null,
            password: hashedPW,
            ldap: false,
            force_reset_pw: false,
            realms: config.app.realms,
            icon: '',
            access: [],
            blocked: false,
            role: 'member',
          },
        },
        {
          projection: {
            _id: 0,
            uid: 1,
            display_name: 1,
            acl: 1,
            role: 1,
            icon: 1,
            mail: 1,
          },
          returnOriginal: false,
          upsert: true,
        },
        function (err, userinfo) {
          if (err) {
            console.error(err.message)
          }

          var defaultConfig = {
            owner: username,
            config: defaultUserConfig,
            name: 'default',
            type: 'matrix',
            readers: [username],
            created: new Date().toUTCString(),
          }
          appDb.collection(collections.configs).insertOne(defaultConfig)

          req.session.role = userinfo.value.role
          req.session.uid = userinfo.value.uid
          req.session.display_name = userinfo.value.display_name
          req.session.mail = userinfo.value.mail
          req.session.celery_tasks = []
          req.session.icon = userinfo.value.icon
          return res.redirect(`${basePath}/`)
        }
      )
    }
  )(req, res, next)
}
