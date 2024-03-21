import qs from 'qs'

const apiPath = '/api/v1'

export const routes = {
  home: `/`,
  userAccount: '/user-account',
  configurations: '/configurations',
  editConfigPage: '/config/:config_id/edit',
  dashboards: `/dashboard`,
  dashboard: (study = ':study', subject = ':subject') =>
    `${routes.dashboards}/${study}/${subject}`,
  studyDashboard: (study = ':study') => `${routes.dashboards}/${study}`,
  charts: '/charts',
  newChart: '/charts/new',
  editChart: (chartId) => `/charts/${chartId}/edit`,
  editChartPage: '/charts/:chart_id/edit',
  viewChartPage: '/charts/:chart_id',
  viewChart: (chartId, queryParams) =>
    queryParams
      ? `/charts/${chartId}${qs.stringify(queryParams, {
          addQueryPrefix: true,
        })}`
      : `/charts/${chartId}`,
  admin: '/admin',
  register: '/register',
  resetpw: '/reset-password',
  signin: '/signin',
  logout: '/logout',
  main: '/main',
  help: '/help',
  contactUs: '/contact-us',
  privacyPolicy: '/privacy-policy',
  previewProfile: '/preview-profile',
  termsOfUse: '/terms-of-use',
  participants: '/participants',
  editConfiguration: (configId) => `/config/${configId}/edit`,
  viewConfiguration: (configId) => `/u/configure?s=view&id=${configId}`,
  newConfiguration: '/configs/new',
}

export const apiRoutes = {
  auth: {
    login: `${apiPath}/login`,
    logout: `${apiPath}/logout`,
    me: `${apiPath}/me`,
    resetPassword: `${apiPath}/resetpw`,
    signup: `${apiPath}/signup`,
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
    show: (chartId) => `${apiPath}/charts/${chartId}/data`,
  },
  chartCsv: {
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
  participants: {
    index: `${apiPath}/participants`,
  },
  users: {
    index: `${apiPath}/users`,
    show: (uid) => `${apiPath}/users/${uid}`,
  },
  chart: {
    show: (chart_id) => `${apiPath}/charts/${chart_id}`,
    index: `${apiPath}/charts`,
  },
  shareChart: {
    show: (chart_id) => `${apiPath}/charts/${chart_id}/share`,
  },
  duplicateChart: {
    show: `${apiPath}/charts/duplicate`,
  },
  subjects: (studies) => `${apiPath}/subjects?q=${JSON.stringify(studies)}`,
  preferences: (uid) => `${apiPath}/users/${uid}/preferences`,
  subject: `${apiPath}/subjects`,
}
