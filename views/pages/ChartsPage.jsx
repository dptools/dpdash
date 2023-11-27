import React, { useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import { Link, useOutletContext } from 'react-router-dom'

import api from '../api'
import ChartsTable from '../tables/ChartsTable'
import PageHeader from '../components/PageHeader'
import ShareChart from '../components/ShareCharts'
import { routes } from '../routes/routes'

const NULL_CHART = {}

const ChartsPage = () => {
  const { user, setNotification, users } = useOutletContext()
  const [chartToShare, setChartToShare] = useState(NULL_CHART)
  const [chartList, setChartList] = useState([])
  const [usernames, setUsernames] = useState([])

  const closeDialog = () => setChartToShare(NULL_CHART)
  const onShare = (chart) => setChartToShare(chart)
  const shareWithUsers = async (chart_id, sharedWith, options = {}) => {
    try {
      await api.charts.chartsShare.create(chart_id, sharedWith)

      const updatedChart = { ...chartToShare, sharedWith }
      const updatedChartList = chartList.map((chart) =>
        chart._id === updatedChart._id ? updatedChart : chart
      )

      setChartList(updatedChartList)
      options.closeDialog ? closeDialog() : setChartToShare(updatedChart)
      setNotification({ open: true, message: 'Shared chart with user' })
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const onDelete = async (chart) => {
    try {
      await api.charts.chart.destroy(chart._id)

      await loadCharts()
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const onDuplicate = async (chart) => {
    try {
      await api.charts.chartsDuplicate.create(chart._id)
      await loadCharts()
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const loadCharts = async () => {
    try {
      const data = await api.charts.chart.index()

      setChartList(data)
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

  useEffect(() => {
    loadCharts()
  }, [])

  useEffect(() => {
    const apiUsernames = users
      .filter(({ uid }) => uid !== user.uid)
      .map(({ uid }) => ({
        value: uid,
        label: uid,
      }))

    setUsernames(apiUsernames)
  }, [users])

  return (
    <Box sx={{ p: '20px' }}>
      <PageHeader
        title="Charts"
        cta={
          <Button
            component={Link}
            to={routes.newChart}
            variant="contained"
            size="small"
            sx={{ backgroundColor: 'primary.dark', textTransform: 'none' }}
          >
            New chart
          </Button>
        }
      />
      <ChartsTable
        onShare={onShare}
        charts={chartList}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        user={user}
      />
      {!!chartToShare._id && (
        <ShareChart
          chart={chartToShare}
          usernames={usernames}
          handleChange={shareWithUsers}
          handleClose={closeDialog}
        />
      )}
    </Box>
  )
}

export default ChartsPage
