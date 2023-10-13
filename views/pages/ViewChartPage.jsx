import React, { useEffect, useState } from 'react'
import qs from 'qs'
import FileSaver from 'file-saver'
import {
  useParams,
  useOutletContext,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Typography } from '@material-ui/core'
import BarGraph from '../components/BarGraph'
import GraphTable from '../components/GraphTable'
import UserAvatar from '../components/UserAvatar'
import ChartFilterForm from '../forms/CharFilterForm'
import { apiRoutes, routes } from '../routes/routes'
import api from '../api'
import StudiesModel from '../models/StudiesModel'

const ViewChartPage = () => {
  const { classes, setNotification } = useOutletContext()
  const { search } = useLocation()
  const { chart_id } = useParams()
  const navigate = useNavigate()
  const [graph, setGraph] = useState(null)
  const { handleSubmit, control, reset } = useForm()
  const handleFormSubmit = async (updatedFilters) => {
    if (!updatedFilters.sites.length) {
      setNotification({
        open: true,
        message: 'Please select a site to view data',
      })
    } else {
      const sites = updatedFilters.sites.map((obj) => obj.value)
      const queryParams = {
        filters: { ...updatedFilters, sites },
      }
      const newRoute = routes.viewChart(chart_id, queryParams)

      navigate(newRoute)
    }
  }
  const fetchGraph = async (chart_id, filters) =>
    await api.charts.chartsData.show(chart_id, { filters })
  const fetchGraphTableCSV = async (chart_id, filters, filename) => {
    const res = await window.fetch(
      apiRoutes.chartCsv.show(chart_id, { filters }),
      {
        headers: {
          'Content-Type': 'text/csv',
        },
        method: 'GET',
      }
    )
    const graphTableData = await res.blob()

    FileSaver.saveAs(graphTableData, `${filename}.csv`)

    return res
  }

  useEffect(() => {
    const parsedQuery = qs.parse(search.replace(/^\?/, ''))

    fetchGraph(chart_id, parsedQuery.filters).then((newGraph) => {
      setGraph(newGraph)
      reset({
        ...newGraph.filters,
        sites: StudiesModel.dropdownSelectOptions(newGraph.filters.sites),
      })
    })
  }, [chart_id, search])

  if (!graph) return <div>Loading...</div>
  return (
    <>
      {graph.description && (
        <div className={classes.viewChartRow}>
          <div className={classes.chartAvatarContainer}>
            <UserAvatar user={graph.chartOwner} />
            <Typography variant="subtitle2" className={classes.chartAvatarName}>
              {graph.chartOwner.display_name}
            </Typography>
          </div>
          <Typography variant="subtitle1">{graph.description}</Typography>
        </div>
      )}
      <div className={classes.filterFormContainer}>
        <ChartFilterForm
          initialValues={{
            ...graph.filters,
            sites: StudiesModel.dropdownSelectOptions(graph.filters.sites),
          }}
          onSubmit={handleSubmit(handleFormSubmit)}
          siteOptions={StudiesModel.dropdownSelectOptions(graph.userSites)}
          classes={classes}
          control={control}
        />
      </div>
      <BarGraph graph={graph} classes={classes} />
      {!!graph.dataBySite.length && (
        <GraphTable
          graph={graph}
          classes={classes}
          onGetCsv={fetchGraphTableCSV}
        />
      )}
    </>
  )
}

export default ViewChartPage
