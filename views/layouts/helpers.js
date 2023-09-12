import { routes } from '../routes/routes'

export const headerTitle = (pathname, params) => {
  if (pathname.includes(routes.dashboards))
    return `${params.study} - ${params.subject}`

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
