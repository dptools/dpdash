import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

import ChartList from '../components/ChartList'
import AddNewChart from '../components/Graphs/AddNewChart'
import ShareChart from '../components/ShareCharts'
import {
  getCharts,
  deleteChart,
  duplicateChart,
  fetchUsernames,
  shareChart,
} from '../fe-utils/fetchUtil'
import { routes } from '../routes/routes'

const NULL_CHART = {}

const ChartsPage = () => {
  const { user, classes, navigate } = useOutletContext()
  const [chartToShare, setChartToShare] = useState(NULL_CHART)
  const [chartList, setChartList] = useState([])
  const [usernames, setUsernames] = useState([])

  const closeDialog = () => setChartToShare(NULL_CHART)
  const handleShareChart = (chart) => setChartToShare(chart)
  const shareWithUsers = async (chart_id, sharedWith, options = {}) => {
    const {
      data: { ok },
    } = await shareChart(chart_id, sharedWith)

    if (ok === 1) {
      const updatedChart = { ...chartToShare, sharedWith }
      const updatedChartList = chartList.map((chart) => {
        return chart._id === updatedChart._id ? updatedChart : chart
      })

      setChartList(updatedChartList)
      options.closeDialog ? closeDialog() : setChartToShare(updatedChart)
    }
  }
  const removeChart = async (id) => {
    const deleted = await deleteChart(id)

    if (deleted.data > 0) {
      await loadCharts()
    }
  }
  const onDuplicateChart = async (id) => {
    const { data: duplicateChartId } = await duplicateChart(id)

    if (!!duplicateChartId) {
      await loadCharts()
    }
  }
  const loadCharts = async () => {
    const { data: charts } = await getCharts()
    setChartList(charts)
  }
  const newChart = () => navigate(routes.newChart)

  useEffect(() => {
    loadCharts()
    fetchUsernames().then((data) => {
      const apiUsernames = data
        .filter((username) => username !== user.uid)
        .map((username) => ({
          value: username,
          label: username,
        }))

      setUsernames(apiUsernames)
    })
  }, [])

  return (
    <>
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
    </>
  )
}

export default ChartsPage
