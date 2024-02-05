import React from 'react'
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import useArrayFormFields from '../hooks/useArrayFormFields'
import { targetValuesFields } from '../fe-utils/targetValuesUtil'
import { colors } from '../../constants'
import * as yup from 'yup'

import BarChartFields from './BarChartFields'

const schema = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
  assessment: yup.string().required(),
  variable: yup.string().required(),
  public: yup.boolean(),
  fieldLabelValueMap: yup.array().of(
    yup.object({
      value: yup.string(),
      label: yup.string(),
      color: yup.string(),
      targetValues: yup.object(),
    })
  ),
})

const ChartForm = ({ onSubmit, user, initialValues }) => {
  const { handleSubmit, control, watch } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
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
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BarChartFields
        control={control}
        fields={fields}
        onRemove={removeField}
        onAddNewFields={addNewField}
        fieldsValue={watch('fieldLabelValueMap')}
      />
      <div>
        <Button type="submit" variant="contained">
          Submit Form
        </Button>
      </div>
    </form>
  )
}

export default ChartForm
