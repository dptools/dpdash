import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import useArrayFormFields from '../hooks/useArrayFormFields'
import ChartForm from '../forms/ChartForm'
import { targetValuesFields } from '../fe-utils/targetValuesUtil'
import { routes } from '../routes/routes'
import { colors } from '../../constants/styles'
import api from '../api'

const NewChartPage = () => {
  const { user, navigate, setNotification } = useOutletContext()
  const { handleSubmit, control, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      assessment: '',
      variable: '',
      public: false,
    },
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
  const handleFormSubmit = async (formValues) => {
    try {
      const data = await api.charts.chart.create(formValues)

      navigate(routes.viewChart(data.chart_id))
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

  return (
    <div>
      <ChartForm
        onSubmit={handleSubmit(handleFormSubmit)}
        control={control}
        fields={fields}
        onAddNewFields={addNewField}
        onRemove={removeField}
        fieldsValue={watch('fieldLabelValueMap')}
      />
    </div>
  )
}

export default NewChartPage
