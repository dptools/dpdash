import React from 'react'

import { Box } from '@mui/material'
import { useOutletContext } from 'react-router-dom'

import api from '../api'
import ChartForm from '../forms/ChartForm'
import { routes } from '../routes/routes'

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
