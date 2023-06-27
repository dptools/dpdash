const v1Root = `/api/v1`
const userRoot = `${v1Root}/users/:uid`

export const routes = {
  root: `/`,
  chart: '/charts/:chart_id',
  charts: '/charts',
  editChart: '/charts/:chart_id/edit',
  login: `/login`,
  signup: `/signup`,
  logout: `/logout`,
}

export const v1Routes = {
  auth: {
    me: `${v1Root}/me`,
    login: `${v1Root}/login`,
    logout: `${v1Root}/logout`,
    signup: `${v1Root}/signup`,
    resetpw: `${v1Root}/resetpw`,
  },
  charts: {
    show: `${v1Root}/charts/:chart_id/data`,
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
