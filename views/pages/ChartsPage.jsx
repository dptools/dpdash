import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

import ChartList from '../components/ChartList'
import AddNewChart from '../components/Graphs/AddNewChart'
import ShareChart from '../components/ShareCharts'
import { routes } from '../routes/routes'
import api from '../api'

const NULL_CHART = {}

const ChartsPage = () => {
  const { user, classes, navigate, setNotification, users } = useOutletContext()
  const [chartToShare, setChartToShare] = useState(NULL_CHART)
  const [chartList, setChartList] = useState([])
  const [usernames, setUsernames] = useState([])

  const closeDialog = () => setChartToShare(NULL_CHART)
  const handleShareChart = (chart) => setChartToShare(chart)
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
  const removeChart = async (id) => {
    try {
      await api.charts.chart.destroy(id)

      await loadCharts()
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const onDuplicateChart = async (id) => {
    try {
      await api.charts.chartsDuplicate.create(id)
      await loadCharts()

      setNotification({ open: true, message: 'Chart is now duplicated.' })
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
  const newChart = () => navigate(routes.newChart)

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
    <div className={classes.chartListContainer}>
      <ChartList
        handleShareChart={handleShareChart}
        chartList={chartList}
        removeChart={removeChart}
        onDuplicateChart={onDuplicateChart}
        user={user}
        classes={classes}
      />
      {!!chartToShare._id && (
        <ShareChart
          chart={chartToShare}
          usernames={usernames}
          handleChange={shareWithUsers}
          handleClose={closeDialog}
          classes={classes}
        />
      )}
      <AddNewChart onNewChart={newChart} />
    </div>
  )
}

export default ChartsPage
