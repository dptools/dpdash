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
  const { user, classes, navigate } = useOutletContext()
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
    const data = await api.charts.chart.update(chart_id, formValues)

    if (data.modifiedCount === 1) navigate(routes.viewChart(chart_id))
  }
  const getChart = async () => {
    const data = await api.charts.chart.show(chart_id)

    setLoading(false)

    return data
  }

  if (loading) return <div>Loading...</div>

  return (
    <>
      <ChartForm
        classes={classes}
        control={control}
        onSubmit={handleSubmit(handleformSubmit)}
        onAddNewFields={addNewField}
        onRemove={removeField}
        fields={fields}
        fieldsValue={watch('fieldLabelValueMap')}
      />
    </>
  )
}

export default EditChartPage
