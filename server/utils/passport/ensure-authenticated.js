import basePathConfig from '../../configs/basePathConfig'

const basePath = basePathConfig || ''
const logoutForbiddenRoute = `${basePath}/logout?e=forbidden`
const unauthorizedRoute = `${basePath}/logout?e=unauthorized`

export default function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect(`${basePath}/logout`)
  }
  const { appDb } = req.app.locals
  appDb
    .collection('users')
    .findOne(
      { uid: req.user },
      { 
        _id: 0, 
        access: 1, 
        blocked: 1, 
        role: 1 
      },
      function (err, data) {
        switch(true) {
          case !data || Object.keys(data).length === 0 || !!data.blocked || err:
            return res.redirect(logoutForbiddenRoute)
          case data.access && data.access.length === 0:
            return res.redirect(unauthorizedRoute)
          default:
            return next()
        }
      }
    )
}
