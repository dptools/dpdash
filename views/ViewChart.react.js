import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { chartStyles } from './styles/chart_styles'
import AppLayout from './layouts/AppLayout'
import BarGraph from './components/BarGraph'
import GraphTable from './components/GraphTable'
import ChartFilterForm from './forms/CharFilterForm'
import { routes } from './routes/routes'
import UserAvatar from './components/UserAvatar'

const ViewChart = ({ graph, classes }) => {
  const { title, description, filters, chartOwner } = graph
  const handleSubmit = (updatedFilters) =>
    window.location.assign(
      routes.chart(graph.chart_id, { filters: updatedFilters })
    )

  return (
    <AppLayout title={title}>
      {description && (
        <div className={classes.viewChartRow}>
          <div className={classes.chartAvatarContainer}>
            <UserAvatar user={chartOwner} />
            <Typography variant="subtitle2" className={classes.chartAvatarName}>
              {chartOwner.display_name}
            </Typography>
          </div>
          <Typography variant="subtitle1">{description}</Typography>
        </div>
      )}
      <div className={classes.filterFormContainer}>
        <ChartFilterForm
          initialValues={filters}
          onSubmit={handleSubmit}
          classes={classes}
        />
      </div>
      <BarGraph graph={graph} classes={classes} />
      {!!graph.dataBySite.length && <GraphTable graph={graph} />}
    </AppLayout>
  )
}

const styles = (theme) => ({
  ...chartStyles(theme),
})
const mapStateToProps = (state) => ({
  graph: state.graph,
})

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(mapStateToProps)
)(ViewChart)
