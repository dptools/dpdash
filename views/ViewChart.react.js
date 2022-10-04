import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'

import { Typography } from '@material-ui/core'
import { chartStyles } from './styles/chart_styles'
import AppLayout from './layouts/AppLayout'
import BarGraph from './components/Graphs/BarGraph'
import GraphTable from './components/Graphs/GraphTable'

const ViewChart = ({ graph, classes }) => {
  const { title, description } = graph
  return (
    <AppLayout title={title?.toUpperCase()}>
      <Typography variant="title" gutterBottom>
        {description?.toUpperCase()}
      </Typography>
      <BarGraph graph={graph} classes={classes} />
      <GraphTable graph={graph} />
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
