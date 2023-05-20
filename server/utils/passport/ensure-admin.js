import { routes } from '../routes'

export default function ensureAdmin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect(routes.logout)
  }
  const { appDb } = req.app.locals
  appDb
    .collection('users')
    .findOne(
      { uid: req.user, role: 'admin' },
      { _id: 0, uid: 1 },
      function (err, data) {
        if (err) {
          console.log(err)
          return res.redirect(`${routes.root}?e=forbidden`)
        } else if (!data || Object.keys(data).length === 0) {
          return res.redirect(`${routes.root}?e=forbidden`)
        } else {
          return next()
        }
      }
    )
}
