import passport from 'passport'
import config from '../../configs/config'
import defaultUserConfig from '../../configs/defaultUserConfig'
import basePathConfig from '../../configs/basePathConfig'
import { collections } from '../mongoCollections'

const basePath = basePathConfig || ''

function getRealms(user) {
  if (user != null && user.realms) {
    return user.realms
  } else {
    config.app.realms
  }
}

function getUserIcon(user) {
  if (user != null && user.icon) {
    return user.icon
  } else {
    return ''
  }
}

function getUserRoles(user) {
  if (user != null && user.role) {
    return user.role
  } else {
    return 'member'
  }
}
function getUserAccess(user) {
  if (user != null && user.access) {
    return user.access
  } else {
    return []
  }
}

function getUserBlocked(user) {
  if (user != null && user.blocked) {
    return user.blocked
  } else {
    return false
  }
}

function getUserName(user, ldap_name) {
  if (user != null && user.display_name) {
    return user.display_name
  } else if (ldap_name) {
    return ldap_name
  } else {
    return ''
  }
}

function getUserMail(user, ldap_email) {
  if (user != null && user.mail) {
    return user.mail
  } else if (ldap_email) {
    return ldap_email
  } else {
    return ''
  }
}

function getUserTitle(user, ldap_title) {
  if (user != null && user.title) {
    return user.title
  } else if (ldap_title) {
    return ldap_title
  } else {
    return ''
  }
}

function getUserDpt(user, ldap_dpt) {
  if (user != null && user.department) {
    return user.department
  } else if (ldap_dpt) {
    return ldap_dpt
  } else {
    return ''
  }
}

function getUserCompany(user, ldap_company) {
  if (user != null && user.company) {
    return user.company
  } else if (ldap_company) {
    return ldap_company
  } else {
    return ''
  }
}

export default (req, res, next) => {
  passport.serializeUser(function (user, done) {
    done(null, user.uid)
  })

  passport.deserializeUser(function (user, done) {
    done(null, user)
  })
  passport.authenticate(
    'ldapauth',
    { session: true },
    function (err, user, info) {
      if (err) {
        return res.redirect(`${basePath}/login?e=${err}`)
      }
      if (!user) {
        return res.redirect(`${basePath}/login?e=forbidden`)
      }
      req.login(user, function (err) {
        if (err) return next(err)
        const { appDb } = req.app.locals
        const uid = user.uid
        appDb
          .collection(collections.users)
          .findOne(
            { uid: uid },
            { realms: 1, role: 1, icon: 1, access: 1, blocked: 1 },
            function (err, userObj) {
              if (err) console.error(err.message)

              const userRealms = getRealms(userObj)
              const userIcon = getUserIcon(userObj)
              const userName = getUserName(userObj, user.cn)
              const userRoles = getUserRoles(userObj)
              const userAccess = getUserAccess(userObj)
              const userBlocked = getUserBlocked(userObj)
              const userMail = getUserMail(userObj, user.mail)
              const userDpt = getUserDpt(userObj, user.department)
              const userCompany = getUserCompany(userObj, user.company)
              const userTitle = getUserTitle(userObj, user.title)

              appDb
                .collection(collections.configs)
                .findOne({ owner: uid }, function (err, configObj) {
                  if (!configObj) {
                    const defaultConfig = {
                      owner: uid,
                      config: defaultUserConfig,
                      name: 'default',
                      type: 'matrix',
                      readers: [uid],
                      created: new Date().toUTCString(),
                    }
                    appDb
                      .collection(collections.configs)
                      .insertOne(defaultConfig)
                  }
                  appDb.collection(collections.users).findOneAndUpdate(
                    { uid: uid },
                    {
                      $set: {
                        display_name: userName,
                        title: userTitle,
                        department: userDpt,
                        company: userCompany,
                        mail: userMail,
                        member_of: user.memberOf,
                        bad_pwd_count: user.badPwdCount,
                        lockout_time: user.lockoutTime,
                        last_logoff: user.lastLogoff,
                        last_logon: user.lastLogon,
                        account_expires: user.accountExpires,
                        password: null,
                        ldap: true,
                        force_reset_pw: false,
                        realms: userRealms,
                        icon: userIcon,
                        role: userRoles,
                        blocked: userBlocked,
                        access: userAccess,
                      },
                    },
                    {
                      upsert: true,
                      returnOriginal: false,
                    },
                    function (err, userinfo) {
                      if (err) {
                        console.error(err.message)
                      }
                      client.close()
                      req.session.role = userRoles
                      req.session.display_name = userName
                      req.session.mail = userMail
                      req.session.celery_tasks = []
                      req.session.icon = userIcon
                      return res.redirect(`${basePath}/`)
                    }
                  )
                })
            }
          )
      })
    }
  )(req, res, next)
}
