import qs from 'qs'
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
  chart: (chart_id, queryParams) =>
    queryParams
      ? `${basePath}/charts/${chart_id}?${qs.stringify(queryParams)}`
      : `${basePath}/charts/${chart_id}`,
  editChart: (chart_id) => `${basePath}/charts/${chart_id}/edit`,
  subjectView: (study, subject) => `${basePath}/dashboard/${study}/${subject}`,
  chartCsv: (chart_id, queryParams) => routes.chart(chart_id, queryParams),
}

export const apiRoutes = {
  chart: (chart_id) => `${apiPath}/charts/${chart_id}`,
  charts: `${apiPath}/charts`,
  chartDuplicate: `${apiPath}/charts/duplicate`,
  subjects: (studies) => `${apiPath}/subjects?q=${JSON.stringify(studies)}`,
  studyDetail: (study_id) => `${apiPath}/study-details/${study_id}`,
  studyDetails: `${apiPath}/study-details`,
  configs: (uid) => `${apiPath}/users/${uid}/configs`,
  preferences: (uid) => `${apiPath}/users/${uid}/preferences`,
  searchStudies: `${apiPath}/search/studies`,
  subject: `${apiPath}/subjects`,
  shareChart: (chart_id) => `${apiPath}/charts/${chart_id}/share`,
  updateUser: (uid) => `${apiPath}/admin/users/${uid}`,
}

export const defaultApiOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
}
