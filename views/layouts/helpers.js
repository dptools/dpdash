import { routes } from '../routes/routes'
export const headerTitle = (pathname) => {
  switch (true) {
    case pathname === routes.configs:
      return 'Configurations'
    default:
      return 'DpDash'
  }
}
