import React from 'react'

import AppLayout from './layouts/AppLayout'
import ChartForm from './forms/ChartForm'

import { createChart } from './fe-utils/fetchUtil'

const NewChart = () => {
  const handleSubmit = async (e, formValues) => {
    e.preventDefault()
    await createChart(formValues)
  }

  return (
    <AppLayout title='Create a Chart'>
      <ChartForm handleSubmit={handleSubmit} />
    </AppLayout>
  )
}

export default NewChart
