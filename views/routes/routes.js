import basePathConfig from '../../server/configs/basePathConfig'

const basePath = basePathConfig || ''
const apiPath = `${basePath}/api/v1`

export const routes = {
  basePath,
  home: `${basePath}/`,
  userAccount: `${basePath}/u`,
  newChart: `${basePath}/charts/new`,
  configure: `${basePath}/u/configure`,
  dashboard: `${basePath}/dashboard`,
  charts: `${basePath}/charts`,
  reports: `${basePath}/reports`,
  admin: `${basePath}/admin`,
  logout: `${basePath}/logout`,
  studyDetails: `${basePath}/study-details`,
  chart: (chart_id) => `${basePath}/charts/${chart_id}`,
  editChart: (chart_id) => `${basePath}/charts/${chart_id}/edit`,
}

export const apiRoutes = {
  chart: (chart_id) => `${apiPath}/charts/${chart_id}`,
  charts: `${apiPath}/charts`,
  subjects: (studies) => `${apiPath}/subjects?q=${JSON.stringify(studies)}`,
  studyDetail: (study_id) => `${apiPath}/study-details/${study_id}`,
  studyDetails: `${apiPath}/study-details`,
}

export const defaultApiOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
}
