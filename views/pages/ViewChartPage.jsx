import React, { useEffect, useState } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import BarGraph from '../components/BarGraph'
import GraphTable from '../components/GraphTable'
import UserAvatar from '../components/UserAvatar'
import ChartFilterForm from '../forms/CharFilterForm'
import { apiRoutes } from '../routes/routes'

const ViewChartPage = () => {
  const { classes } = useOutletContext()
  const { chart_id } = useParams()
  const [graph, setGraph] = useState(null)

  const handleSubmit = (updatedFilters) => fetchGraph(chart_id, updatedFilters)
  const fetchGraph = async (chart_id, filters) => {
    return await fetch(apiRoutes.chartData.show(chart_id, filters))
      .then((res) => res.json())
      .then(({ data }) => {
        setGraph(data)
      })
  }
  useEffect(() => {
    fetchGraph(chart_id)
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
          onSubmit={handleSubmit}
          classes={classes}
        />
      </div>
      <BarGraph graph={graph} classes={classes} />
      {!!graph.dataBySite.length && (
        <GraphTable graph={graph} classes={classes} />
      )}
    </>
  )
}

export default ViewChartPage
