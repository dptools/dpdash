import { routes } from '../routes'

export default function ensureUser(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect(`${routes.logout}?e=forbidden`)
  } else if (req.params.uid !== req.user) {
    return res.redirect(`${routes.root}?e=forbidden`)
  } else {
    return next()
  }
}
