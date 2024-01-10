import React, { useState, useEffect } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { Box } from '@mui/material'

import ChartForm from '../forms/ChartForm'
import { routes } from '../routes/routes'

import api from '../api'

const EditChartPage = () => {
  const { chart_id } = useParams()
  const { user, navigate, setNotification } = useOutletContext()
  const [loading, setLoading] = useState(true)
  const [initialValues, setInitialValues] = useState(null)

  const handleSubmit = async (formValues) => {
    try {
      const data = await api.charts.chart.update(chart_id, formValues)

      navigate(routes.viewChart(data._id))
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

  const getChart = async () => {
    try {
      return await api.charts.chart.show(chart_id)
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

  useEffect(() => {
    getChart().then((chartValues) => {
      setInitialValues(chartValues)
      setLoading(false)
    })
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <Box sx={{ p: '25px' }}>
      <ChartForm
        onSubmit={handleSubmit}
        user={user}
        initialValues={initialValues}
      />
    </Box>
  )
}

export default EditChartPage
