import React, { useEffect, useState } from 'react'
import qs from 'qs'
import FileSaver from 'file-saver'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Typography, Avatar } from '@mui/material'

import BarGraph from '../components/BarGraph'
import GraphTable from '../components/GraphTable'
import ChartFilterForm from '../forms/ChartFilterForm'
import { apiRoutes, routes } from '../routes/routes'
import api from '../api'
import StudiesModel from '../models/StudiesModel'

const ViewChartPage = () => {
  const { search } = useLocation()
  const { chart_id } = useParams()
  const navigate = useNavigate()
  const [graph, setGraph] = useState(null)
  const onSubmit = async (formValues) => {
    const filters = {
      ...formValues,
      sites: formValues.sites.map((option) => option.value),
    }
    const newRoute = routes.viewChart(chart_id, { filters })

    navigate(newRoute)
  }
  const fetchGraph = async (chart_id, filters) =>
    await api.charts.chartsData.show(chart_id, { filters })
  const fetchGraphTableCSV = async (chart_id, filters, filename) => {
    const res = await fetch(apiRoutes.chartCsv.show(chart_id, { filters }), {
      headers: {
        'Content-Type': 'text/csv',
      },
      method: 'GET',
    })
    const graphTableData = await res.blob()

    FileSaver.saveAs(graphTableData, `${filename}.csv`)

    return res
  }
  const siteOptions = graph
    ? StudiesModel.dropdownSelectOptions(graph.userSites)
    : []

  useEffect(() => {
    const parsedQuery = qs.parse(search.replace(/^\?/, ''))

    fetchGraph(chart_id, parsedQuery.filters).then((newGraph) => {
      setGraph(newGraph)
    })
  }, [chart_id, search])

  if (!graph) return <div>Loading...</div>

  return (
    <>
      {graph.description && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              alt={graph.chartOwner.display_name}
              src={graph.chartOwner.icon}
              sx={{ width: 24, height: 24 }}
            />
            <Typography variant="subtitle2" sx={{ paddingLeft: '8px' }}>
              {graph.chartOwner.display_name}
            </Typography>
          </div>
          <Typography variant="subtitle1">{graph.description}</Typography>
        </div>
      )}
      <div>
        <ChartFilterForm
          initialValues={{
            ...graph.filters,
            sites: siteOptions.filter((option) =>
              graph.filters.sites.includes(option.value)
            ),
          }}
          onSubmit={onSubmit}
          siteOptions={siteOptions}
        />
      </div>
      <BarGraph graph={graph} />
      {!!graph.dataBySite.length && (
        <GraphTable graph={graph} onGetCsv={fetchGraphTableCSV} />
      )}
    </>
  )
}

export default ViewChartPage
