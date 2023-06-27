const v1Root = `/api/v1`
const userRoot = `${v1Root}/users/:uid`

export const routes = {
  root: `/`,
  chart: '/charts/:chart_id',
  charts: '/charts',
  editChart: '/charts/:chart_id/edit',
  newChart: '/charts/new',
  login: `/login`,
  signup: `/signup`,
  logout: `/logout`,
}

export const v1Routes = {
  auth: {
    login: `${v1Root}/login`,
    logout: `${v1Root}/logout`,
    me: `${v1Root}/me`,
  },
  config: {
    index: `${userRoot}/configs`,
    show: `${userRoot}/configs/:config_id`,
  },
  adminRoutes: {
    show: `${v1Root}/admin/users/:uid`,
  },
  users: {
    show: userRoot,
  },
}
