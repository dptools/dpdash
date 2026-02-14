import { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form'
import { useOutletContext } from 'react-router-dom'

import useTableSort from './useTableSort'
import api from '../api'

const NULL_CHART = {}
const title = 'title'

export default function useChartsList() {
  const { setNotification, setUser, user, users } = useOutletContext()
  const { onSort, sortDirection, sortBy } = useTableSort(title)

  const { uid, favoriteCharts } = user
  const favoriteChartsSet = new Set(favoriteCharts)

  const [chartToShare, setChartToShare] = useState(NULL_CHART)
  const [chartList, setChartList] = useState([])
  const [sharedWithOptions, setSharedWithOptions] = useState([])

  const {
    handleSubmit,
    control: shareFormControl,
    reset,
    watch,
    getValues,
  } = useForm({
    defaultValues: {
      chart_id: chartToShare._id,
      sharedWith: chartToShare.sharedWith || [],
    },
  })
  const [shareFormValues, setShareFormValues] = useState(getValues())

  useEffect(() => {
    const subscription = watch((value) => {
      setShareFormValues(value)
    })

    return () => subscription.unsubscribe()
  }, [watch, setShareFormValues])

  const closeDialog = () => setChartToShare(NULL_CHART)
  const onShare = (chart) => {
    setChartToShare(chart)
    reset({
      chart_id: chart._id,
      sharedWith: chart.sharedWith,
    })
  }
  const clearSelectedUsers = () => {
    reset({
      chart_id: chartToShare._id,
      sharedWith: [],
    })
  }
  const selectAllUsers = () => {
    reset({
      chart_id: chartToShare._id,
      sharedWith: sharedWithOptions.map(({ value }) => value),
    })
  }
  const shareWithUsers = handleSubmit(async ({ chart_id, sharedWith }) => {
    try {
      await api.charts.chartsShare.create(chart_id, sharedWith)

      const updatedChart = { ...chartToShare, sharedWith }
      const updatedChartList = chartList.map((chart) =>
        chart._id === updatedChart._id ? updatedChart : chart
      )

      setChartList(updatedChartList)
      setChartToShare(NULL_CHART)
      setNotification({ open: true, message: 'Shared chart with user' })
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  })
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
  const onFavorite = async (chart) => {
    try {
      const isChartInSet = favoriteChartsSet.has(chart._id)

      if (isChartInSet) {
        favoriteChartsSet.delete(chart._id)
      } else {
        favoriteChartsSet.add(chart._id)
      }

      const updatedUser = await api.users.update(uid, {
        ...user,
        favoriteCharts: Array.from(favoriteChartsSet),
      })

      setUser(updatedUser)

      await loadCharts()
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const loadCharts = async (queryParams) => {
    try {
      const params = {
        ...(queryParams ? queryParams : {}),
        ...(sortBy ? { sortBy } : {}),
        ...(sortDirection ? { sortDirection } : {}),
      }
      const data = await api.charts.chart.all(params)

      setChartList(data)
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

  const handleSearch = async (formData) => await loadCharts(formData)

  useEffect(() => {
    loadCharts()
  }, [sortBy, sortDirection])

  useEffect(() => {
    const apiUsernames = users
      .filter(({ uid }) => uid !== user.uid)
      .map(({ uid, display_name }) => ({
        value: uid,
        label: display_name,
      }))

    setSharedWithOptions(apiUsernames)
  }, [users])

  return {
    charts: chartList,
    chartToShare,
    closeDialog,
    handleSearch,
    onFavorite,
    onShare,
    onSort,
    onDelete,
    onDuplicate,
    shareWithUsers,
    sortDirection,
    sortBy,
    user,
    sharedWithOptions,
    shareFormControl,
    shareFormValues,
    selectAllUsers,
    clearSelectedUsers,
  }
}
