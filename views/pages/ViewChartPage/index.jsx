import React, { useEffect, useState } from 'react'
import qs from 'qs'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import advanced from 'dayjs/plugin/advancedFormat'
import utc from 'dayjs/plugin/utc'
import FileSaver from 'file-saver'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

import BarGraph from '../../components/BarGraph'
import GraphTable from '../../components/GraphTable'
import ChartFilterForm from '../../forms/ChartFilterForm'
import PageHeader from '../../components/PageHeader'
import ChartDescription from '../../components/ChartDescription'
import { apiRoutes, routes } from '../../routes/routes'
import api from '../../api'
import { SITES_KEY } from '../../../server/constants'
import { fontSize } from '../../../constants'

import './ViewChartPage.css'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advanced)

const ViewChartPage = () => {
  const { search } = useLocation()
  const { chart_id } = useParams()
  const [graph, setGraph] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const shortDescription = graph?.description?.substring(0, 296) + '...' || ''
  const handleDescriptionExpand = () => setExpanded(!expanded)
  const navigate = useNavigate()
  const onSubmit = async (formValues) => {
    const filters = formValuesTofilters(formValues)
    const newRoute = routes.viewChart(chart_id, { filters })

    navigate(newRoute)
  }
  const formValuesTofilters = (formValues) => {
    return Object.keys(formValues).reduce((filterObj, key) => {
      filterObj[key] = Object.keys(formValues[key]).reduce(
        (filterValues, filterKey) => {
          const filter = formValues[key][filterKey]

          filterValues[filter.label] = {
            ...filter,
            value: Number(filter.value),
          }

          return filterValues
        },
        {}
      )

      return filterObj
    }, {})
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
  const handleNavigateToChartPage = () => navigate('charts')

  useEffect(() => {
    const parsedQuery = qs.parse(search.replace(/^\?/, ''))

    fetchGraph(chart_id, parsedQuery.filters).then((newGraph) => {
      setGraph(newGraph)
    })
  }, [chart_id, search])

  if (!graph) return <div>Loading...</div>

  return (
    <Box sx={{ p: '25px' }}>
      <PageHeader
        title={graph.title}
        onNavigate={handleNavigateToChartPage}
        isDescription
        description={
          <ChartDescription
            description={graph.description || ''}
            shortDescription={shortDescription}
            onExpand={handleDescriptionExpand}
            expanded={expanded}
          />
        }
      />
      <div className="ChartPageDetails">
        <Typography
          sx={{
            color: 'grey.A400',
            fontSize: fontSize[14],
            gridColumnStart: 1,
            gridColumnEnd: 4,
          }}
        >
          Last Modified:
          {graph.lastModified
            ? dayjs(graph.lastModified).format('MMM D YYYY @ hh:mm Z')
            : ''}
        </Typography>
        <span className="ChartPageOwner">
          <Typography
            sx={{
              color: 'grey.A400',
              fontSize: fontSize[14],
            }}
          >
            Created by:
          </Typography>
          <Typography
            sx={{
              fontSize: fontSize[14],
              pl: '4px',
            }}
          >
            {` ${graph.chartOwner.display_name}`}
          </Typography>
        </span>
      </div>
      <ChartFilterForm initialValues={graph.filters} onSubmit={onSubmit} />
      <BarGraph graph={graph} />
      {!!graph.dataBySite.length && (
        <GraphTable graph={graph} onGetCsv={fetchGraphTableCSV} />
      )}
    </Box>
  )
}

export default ViewChartPage
