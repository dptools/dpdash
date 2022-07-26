import basePathConfig from '../../server/configs/basePathConfig';

const basePath = basePathConfig || '';

export const routes = {
  basePath,
  home: `${basePath}/`,
  userAccount : `${basePath}/u`,
  newChart: `${basePath}/charts/new`,
  configure: `${basePath}/u/configure`,
  dashboard: `${basePath}/dashboard`,
  charts: `${basePath}/charts`,
  reports: `${basePath}/reports`,
  admin: `${basePath}/admin`,
  logout: `${basePath}/logout`,
  studyDetails: `${basePath}/study-details`,
  chart: (chart_id) => `${basePath}/charts/${chart_id}`
}

export const defaultApiOptions = {    
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'same-origin'
}