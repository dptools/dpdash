import passport from 'passport'
import { verifyHash } from '../crypto/hash'
import { collections } from '../mongoCollections'
import defaultUserConfig from '../../configs/defaultUserConfig'
import basePathConfig from '../../configs/basePathConfig'

const basePath = basePathConfig || ''

export default (req, res, next, user) => {
  //validate submitted password
  if (!verifyHash(req.body.password, user.password)) {
    return res.redirect(`${basePath}/login?e=forbidden`)
  }
  //passport local log-in serializer
  passport.serializeUser(function (user, done) {
    done(null, user.uid)
  })
  passport.deserializeUser(function (user, done) {
    done(null, user)
  })
  //If the user exists, serialize the user to the session
  req.login(user, function (err) {
    const { appDb } = req.app.locals
    const uid = user.uid

    appDb.collection(collections.configs).findOne(
      {
        ower: uid,
      },
      function (err, configObj) {
        if (err) {
          console.error(err.message)
        }
        if (!configObj) {
          const defaultConfig = {
            owner: uid,
            config: defaultUserConfig,
            name: 'default',
            type: 'matrix',
            readers: [uid],
            created: new Date().toUTCString(),
          }
          appDb.collection(collections.configs).insertOne(defaultConfig)
        }
        appDb.collection(collections.users).findOneAndUpdate(
          { uid: user.uid },
          {
            $set: {
              last_logon: Date.now(),
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
              access: 1,
            },
            returnOriginal: false,
            upsert: true,
          },
          function (err, userinfo) {
            if (err) {
              console.error(err.message)
            }
            req.session.role = userinfo.value.role
            req.session.display_name = userinfo.value.display_name
            req.session.mail = userinfo.value.mail
            req.session.celery_tasks = []
            req.session.icon = userinfo.value.icon
            req.session.userAccess = userinfo.value.access
            return res.redirect(`${basePath}/`)
          }
        )
      }
    )
  })
}
