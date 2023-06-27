import { routes } from '../routes/routes'

export const headerTitle = (pathname) => {
  switch (true) {
    case pathname === routes.configs:
      return 'Configurations'
    case pathname === routes.main:
      return 'Participant View'
    default:
      return 'DpDash'
  }
}
