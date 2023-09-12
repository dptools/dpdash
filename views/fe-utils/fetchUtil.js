import FileSaver from 'file-saver'
import basePathConfig from '../../server/configs/basePathConfig'
import { defaultApiOptions, apiRoutes, routes } from '../routes/routes'
const basePath = basePathConfig || ''

const fetchStudiesAdmin = async () => {
  const res = await window.fetch(`${basePath}/api/v1/search/studies`, {
    ...defaultApiOptions,
    method: 'GET',
  })
  if (res.status !== 200) {
    throw new Error(res.statusText)
  }
  return res.json()
}

const fetchStudies = async () => {
  const res = await window.fetch(`${basePath}/api/v1/studies`, {
    ...defaultApiOptions,
    method: 'GET',
  })
  if (res.status !== 200) {
    throw new Error(res.statusText)
  }
  return res.json()
}

const fetchSubjects = async () => {
  const userAccess = await window.fetch(`${basePath}/api/v1/studies`, {
    ...defaultApiOptions,
    method: 'GET',
  })
  if (userAccess.status !== 200) {
    throw new Error(userAccess.statusText)
  }
  const studiesJson = await userAccess.json()
  const studies = studiesJson ? studiesJson : []
  const subjectsResponse = await window.fetch(apiRoutes.subjects(studies), {
    ...defaultApiOptions,
    method: 'GET',
  })
  if (subjectsResponse.status !== 200) {
    throw new Error(subjectsResponse.statusText)
  }
  return subjectsResponse.json()
}

const fetchUsernames = async () => {
  try {
    const res = await window.fetch(`${basePath}/api/v1/search/users`, {
      defaultApiOptions,
      method: 'GET',
    })
    if (res.status !== 200) {
      throw new Error(res.statusText)
    }
    return res.json()
  } catch (error) {
    throw new Error(error)
  }
}

const createChart = async (formValues) => {
  const res = await window.fetch(apiRoutes.charts, {
    ...defaultApiOptions,
    method: 'POST',
    body: JSON.stringify(formValues),
  })

  if (res.status !== 200) return new Error(res.message)

  return res.json()
}

const getCharts = async () => {
  const res = await window.fetch(apiRoutes.charts, {
    ...defaultApiOptions,
    method: 'GET',
  })

  if (res.status !== 200) return new Error(res.message)

  return res.json()
}

const deleteChart = async (id) => {
  const res = await window.fetch(apiRoutes.chart(id), {
    ...defaultApiOptions,
    method: 'DELETE',
  })

  if (res.status !== 200) return new Error(res.message)

  return res.json()
}

const editChart = async (id, formValues) => {
  const res = await window.fetch(apiRoutes.chart(id), {
    ...defaultApiOptions,
    method: 'PATCH',
    body: JSON.stringify(formValues),
  })

  if (res.status !== 200) return new Error(res.message)

  return res.json()
}

const getChart = async (id) => {
  const res = await window.fetch(apiRoutes.chart(id), {
    ...defaultApiOptions,
    method: 'GET',
  })

  if (res.status !== 200) return new Error(res.message)

  return res.json()
}

const duplicateChart = async (chart_id) => {
  const res = await window.fetch(apiRoutes.chartDuplicate, {
    ...defaultApiOptions,
    method: 'POST',
    body: JSON.stringify({ chart_id }),
  })

  if (res.status !== 200) return new Error(res.message)

  return res.json()
}

const fetchPreferences = async (uid) => {
  const res = await window.fetch(apiRoutes.preferences(uid), {
    ...defaultApiOptions,
    method: 'GET',
  })

  if (res.status !== 200) return new Error(res.message)

  return res.json()
}

const shareChart = async (chart_id, sharedWith) => {
  const res = await window.fetch(apiRoutes.shareChart(chart_id), {
    ...defaultApiOptions,
    method: 'POST',
    body: JSON.stringify({ sharedWith }),
  })
  if (res.status !== 200) return new Error(res.message)

  return res.json()
}

const fetchGraphTableCSV = async (chart_id, filters, filename) => {
  const res = await window.fetch(routes.chartCsv(chart_id, filters), {
    headers: {
      'Content-Type': 'text/csv',
    },
    method: 'GET',
  })
  const graphTableData = await res.blob()
  FileSaver.saveAs(graphTableData, `${filename}.csv`)

  return res
}

export {
  fetchStudies,
  fetchStudiesAdmin,
  fetchSubjects,
  fetchUsernames,
  createChart,
  getCharts,
  deleteChart,
  editChart,
  getChart,
  duplicateChart,
  fetchPreferences,
  shareChart,
  fetchGraphTableCSV,
}
