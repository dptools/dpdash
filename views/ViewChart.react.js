import React from 'react'
import { connect } from 'react-redux'

import { Typography } from '@material-ui/core'

import AppLayout from './layouts/AppLayout'
import BarGraph from './components/Graphs/BarGraph'
import GraphTable from './components/Graphs/GraphTable'

const ViewChart = ({ graph }) => {
  const { title, description } = graph
  return (
    <AppLayout title={title?.toUpperCase()}>
      <Typography variant="title" gutterBottom>
        {description?.toUpperCase()}
      </Typography>
      <BarGraph graph={graph} />
      <GraphTable graph={graph} />
    </AppLayout>
  )
}

const mapStateToProps = (state) => ({
  graph: state.graph,
})
export default connect(mapStateToProps)(ViewChart)
