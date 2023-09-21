import React, { useEffect, useState } from 'react'
import FileSaver from 'file-saver'
import { useParams, useOutletContext } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Typography } from '@material-ui/core'
import BarGraph from '../components/BarGraph'
import GraphTable from '../components/GraphTable'
import UserAvatar from '../components/UserAvatar'
import ChartFilterForm from '../forms/CharFilterForm'
import { apiRoutes } from '../routes/routes'
import api from '../api'

const ViewChartPage = () => {
  const { classes } = useOutletContext()
  const { chart_id } = useParams()
  const [graph, setGraph] = useState(null)
  const { handleSubmit, control, reset } = useForm()
  const handleFormSubmit = async (updatedFilters) => {
    const graph = await fetchGraph(chart_id, updatedFilters)

    setGraph(graph)
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
    fetchGraph(chart_id).then((graph) => {
      setGraph(graph)
      reset(graph.filters)
    })
  }, [])

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
          initialValues={graph.filters}
          onSubmit={handleSubmit(handleFormSubmit)}
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
