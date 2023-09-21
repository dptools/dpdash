import React, { useState } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useArrayFormFields from '../hooks/useArrayFormFields'

import ChartForm from '../forms/ChartForm'
import { routes } from '../routes/routes'
import { colors } from '../../constants/styles'
import { targetValuesFields } from '../fe-utils/targetValuesUtil'
import api from '../api'

const EditChartPage = () => {
  const { chart_id } = useParams()
  const { user, classes, navigate, setNotification } = useOutletContext()
  const [loading, setLoading] = useState(true)
  const { handleSubmit, control, watch } = useForm({
    defaultValues: async () => await getChart(),
  })
  const { fields, addNewField, removeField } = useArrayFormFields({
    control,
    name: 'fieldLabelValueMap',
    defaultFieldValue: {
      value: '',
      label: '',
      color: colors.dark_sky_blue,
      targetValues: targetValuesFields(user.access),
    },
  })
  const handleformSubmit = async (formValues) => {
    try {
      const data = await api.charts.chart.update(chart_id, formValues)

      navigate(routes.viewChart(data._id))
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

  const getChart = async () => {
    try {
      const data = await api.charts.chart.show(chart_id)

      setLoading(false)

      return data
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className={classes.chartFormContainer}>
      <ChartForm
        classes={classes}
        control={control}
        onSubmit={handleSubmit(handleformSubmit)}
        onAddNewFields={addNewField}
        onRemove={removeField}
        fields={fields}
        fieldsValue={watch('fieldLabelValueMap')}
      />
    </div>
  )
}

export default EditChartPage
