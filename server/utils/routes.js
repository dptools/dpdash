const v1Root = `/api/v1`

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
  adminRoutes: {
    updateUser: `${v1Root}/admin/users/:uid`,
  },
}
