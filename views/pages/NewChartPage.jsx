import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Box } from '@mui/material'

import ChartForm from '../forms/ChartForm'
import { routes } from '../routes/routes'
import api from '../api'

const NewChartPage = () => {
  const { user, navigate, setNotification } = useOutletContext()

  const handleSubmit = async (formValues) => {
    try {
      const data = await api.charts.chart.create(formValues)

      navigate(routes.viewChart(data.chart_id))
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

  return (
    <Box sx={{ p: '25px' }}>
      <ChartForm
        onSubmit={handleSubmit}
        user={user}
        initialValues={{
          title: '',
          description: '',
          assessment: '',
          variable: '',
          public: false,
        }}
      />
    </Box>
  )
}

export default NewChartPage
