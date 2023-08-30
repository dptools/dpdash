import qs from 'qs'
import basePathConfig from '../../server/configs/basePathConfig'

const basePath = basePathConfig || ''
const apiPath = `${basePath}/api/v1`

export const routes = {
  basePath,
  home: `/`,
  userAccount: '/user-account',
  configs: '/configs',
  editConfigPage: '/config/:config_id/edit',
  dashboards: `${basePath}/dashboard`,
  dashboard: (study = ':study', subject = ':subject') =>
    `${routes.dashboards}/${study}/${subject}`,
  charts: '/charts',
  newChart: '/charts/new',
  editChart: (chartId) => `/charts/${chartId}/edit`,
  editChartPage: '/charts/:chart_id/edit',
  viewChartPage: '/charts/:chart_id',
  viewChart: (chartId) => `/charts/${chartId}`,
  admin: '/admin',
  register: '/register',
  resetpw: '/reset-password',
  login: '/login',
  logout: '/logout',
  main: '/main',
  chartCsv: (chart_id, queryParams) => routes.chart(chart_id, queryParams),
  editConfiguration: (configId) => `/config/${configId}/edit`,
  viewConfiguration: (configId) =>
    `${basePath}/u/configure?s=view&id=${configId}`,
  newConfiguration: '/configs/new',
}

export const apiRoutes = {
  auth: {
    login: `${apiPath}/login`,
    logout: `${apiPath}/logout`,
    me: `${apiPath}/me`,
    resetPassword: `${apiPath}/resetpw`,
  },
  admin: {
    users: {
      show: (uid) => `${apiPath}/admin/users/${uid}`,
    },
    studies: {
      all: `${apiPath}/admin/search/studies`,
    },
  },
  chartData: {
    show: (chartId, queryParams) =>
      queryParams
        ? `${apiPath}/charts/${chartId}/data?${qs.stringify(queryParams)}`
        : `${apiPath}/charts/${chartId}/data`,
  },
  configurations: {
    userConfigurations: (uid) => `${apiPath}/users/${uid}/configs`,
    userConfiguration: (uid, config_id) =>
      `${apiRoutes.configurations.userConfigurations(uid)}/${config_id}`,
    configurationFileUpload: (uid) =>
      `${apiRoutes.configurations.userConfigurations(uid)}/file`,
  },
  dashboards: {
    show: (study = ':study', subject = ':subject') =>
      `${apiPath}/dashboards/${study}/${subject}`,
  },
  users: {
    index: `${apiPath}/users`,
    show: (uid) => `${apiPath}/users/${uid}`,
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
