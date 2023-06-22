import qs from 'qs'
import basePathConfig from '../../server/configs/basePathConfig'

const basePath = basePathConfig || ''
const apiPath = `${basePath}/api/v1`

export const routes = {
  basePath,
  home: `${basePath}/`,
  accountPage: `${basePath}/user-account`,
  userAccount: `${basePath}/u`,
  newChart: `${basePath}/charts/new`,
  configure: `${basePath}/u/configure`,
  configs: `${basePath}/configs`,
  dashboard: `${basePath}/dashboard`,
  charts: `${basePath}/charts`,
  reports: `${basePath}/reports`,
  admin: `${basePath}/admin`,
  login: `${basePath}/login`,
  logout: `${basePath}/logout`,
  studyDetails: `${basePath}/study-details`,
  chart: (chart_id, queryParams) =>
    queryParams
      ? `${basePath}/charts/${chart_id}?${qs.stringify(queryParams)}`
      : `${basePath}/charts/${chart_id}`,
  editChart: (chart_id) => `${basePath}/charts/${chart_id}/edit`,
  subjectView: (study, subject) => `${basePath}/dashboard/${study}/${subject}`,
  chartCsv: (chart_id, queryParams) => routes.chart(chart_id, queryParams),
  editConfiguration: (configId) =>
    `${basePath}/u/configure?s=edit&id=${configId}`,
  viewConfiguration: (configId) =>
    `${basePath}/u/configure?s=view&id=${configId}`,
  configurationSuccess: `${basePath}/u/configure?u=success`,
  invalidConfiguration: `${basePath}/u/configure?u=invalid`,
  configurationError: `${basePath}/u/configure?u=error`,
  createConfiguration: `${basePath}/u/configure?s=add`,
}

export const apiRoutes = {
  auth: {
    login: `${apiPath}/login`,
    me: `${apiPath}/me`,
  },
  configurations: {
    userConfigurations: (uid) => `${apiPath}/users/${uid}/configs`,
    userConfiguration: (uid, config_id) =>
      `${apiRoutes.configurations.userConfigurations(uid)}/${config_id}`,
    configurationFileUpload: (uid) =>
      `${apiRoutes.configurations.userConfigurations(uid)}/file`,
  },
  users: {
    user: (uid) => `${apiPath}/users/${uid}`,
  },
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
