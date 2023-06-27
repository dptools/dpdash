import { routes } from '../routes/routes'

export const headerTitle = (pathname) => {
  switch (pathname) {
    case routes.configs:
      return 'Configurations'
    case routes.main:
      return 'Participant View'
    case routes.userAccount:
      return 'User Profile'
    default:
      return 'DpDash'
  }
}
