import React, { useEffect, useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import AppLayout from './layouts/AppLayout'
import ChartForm from './forms/ChartForm'
import { chartStyles } from './styles/chart_styles'
import { editChart, getChart } from './fe-utils/fetchUtil'
import { routes } from './routes/routes'

const EditChart = ({ classes, graph, user }) => {
  const chartID = graph.chart_id
  const [chart, setChart] = useState()
  const handleSubmit = async (e, formValues) => {
    e.preventDefault()
    const { data } = await editChart(chartID, formValues)

    if (data.ok === 1) window.location.assign(routes.chart(chartID))
  }

  useEffect(() => {
    getChart(chartID).then(({ data }) => setChart(data))
  }, [chartID])

  if (!chart) return null

  return (
    <AppLayout title='Edit chart'>
      <ChartForm
        classes={classes}
        handleSubmit={handleSubmit}
        initialValues={chart}
        studies={user.userAccess}
      />
    </AppLayout>
  )
}

const styles = (theme) => ({
  ...chartStyles(theme),
})
const mapStateToProps = (state) => ({
  graph: state.graph,
  user: state.user,
})

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps)
)(EditChart)
