import FileSaver from 'file-saver'
import basePathConfig from '../../server/configs/basePathConfig'
import { defaultApiOptions, apiRoutes, routes } from '../routes/routes'
const basePath = basePathConfig || ''

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
  fetchUsernames,
  createChart,
  getCharts,
  deleteChart,
  editChart,
  getChart,
  duplicateChart,
  shareChart,
  fetchGraphTableCSV,
}
