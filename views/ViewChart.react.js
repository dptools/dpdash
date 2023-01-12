import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { Button, Drawer, Typography } from '@material-ui/core'
import FilterListIcon from '@material-ui/icons/FilterList'
import { chartStyles } from './styles/chart_styles'
import AppLayout from './layouts/AppLayout'
import BarGraph from './components/BarGraph'
import GraphTable from './components/GraphTable'
import ChartFilterForm from './forms/CharFilterForm'
import { routes } from './routes/routes'

const ViewChart = ({ graph, classes }) => {
  const { title, description, filters } = graph
  const [showFilterMenu, setFilterMenuToggle] = useState(false)
  const openFilterMenu = () => setFilterMenuToggle(true)
  const onCloseFilterMenu = () => setFilterMenuToggle(false)
  const handleSubmit = (updatedFilters) =>
    window.location.assign(
      routes.chart(graph.chart_id, { filters: updatedFilters })
    )

  return (
    <AppLayout title={title}>
      {description && (
        <div className={classes.viewChartRow}>
          <Typography variant="subtitle1">
            <pre style={{ fontFamily: 'inherit' }}>{description}</pre>
          </Typography>
          <Button
            variant="outline"
            color="default"
            className={classes.showFilterButton}
            onClick={() => openFilterMenu()}
          >
            <FilterListIcon className={classes.leftIcon} />
            Filters
          </Button>
        </div>
      )}
      <Drawer anchor="left" open={showFilterMenu} onClose={onCloseFilterMenu}>
        <ChartFilterForm
          initialValues={filters}
          onSubmit={handleSubmit}
          classes={classes}
        />
      </Drawer>
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
