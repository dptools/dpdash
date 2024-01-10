import React from 'react'
import { Fab } from '@mui/material'
import { AddCircleOutline, Save } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import useArrayFormFields from '../../hooks/useArrayFormFields'
import { UserConfigModel } from '../../models'

import ConfigFormFields from '../ConfigFields'
import './ConfigForm.css'

const schema = yup.object({
  configName: yup.string().required(),
  configType: yup.string().required(),
  readers: yup.array().of(
    yup.object({
      value: yup.string(),
      label: yup.string(),
      isFixed: yup.boolean(),
    })
  ),
  public: yup.boolean(),
  owner: yup.string().required(),
  config: yup.array().of(
    yup.object({
      category: yup.string(),
      analysis: yup.string(),
      variable: yup.string(),
      label: yup.string(),
      color: yup.number(),
      min: yup.string(),
      max: yup.string(),
    })
  ),
})

const ConfigForm = ({ colors, friendsList, initialValues, onSubmit }) => {
  const defaultFieldValue = UserConfigModel.defaultConfigValues
  const { handleSubmit, control, getValues } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  })
  const { fields, addNewField, removeField } = useArrayFormFields({
    control,
    name: 'config',
    defaultFieldValue,
  })
  const onCopy = (configCategoryIndex) =>
    addNewField(getValues(`config[${configCategoryIndex}]`))

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ConfigFormFields
        control={control}
        fields={fields}
        onRemove={removeField}
        onCopy={onCopy}
        colors={colors}
        friendsList={friendsList}
      />
      <div className="ConfigFormActions">
        <Fab color="primary" onClick={() => addNewField()} sx={{ p: '5px' }}>
          <AddCircleOutline />
        </Fab>
        <Fab type="submit" sx={{ p: '5px' }}>
          <Save />
        </Fab>
      </div>
    </form>
  )
}

export default ConfigForm
