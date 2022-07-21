import React from 'react'

import AppLayout from './layouts/AppLayout'
import ChartList from './components/ChartList'
import AddNewChart from './components/Graphs/AddNewChart'

const Charts = () => {
  return (
    <AppLayout title='Charts'>
      <ChartList />
      <AddNewChart />
    </AppLayout>
  )
}

export default Charts
