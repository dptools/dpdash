import React from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@mui/material'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import useArrayFormFields from '../../hooks/useArrayFormFields'
import { UserConfigModel } from '../../models'
import ConfigFormFields from '../ConfigFields'
import './ConfigForm.css'

const schema = yup.object({
  configName: yup.string().required(),
  configType: yup.string().required(),
  description: yup.string(),
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
      text: yup.boolean(),
    })
  ),
  status: yup.number(),
})

const ConfigForm = ({
  colors,
  friendsList,
  initialValues,
  onSubmit,
  assessmentOptions,
  handleClearAssessments,
  handleAssessmentSearch,
  handleSubmitDraft,
}) => {
  const defaultFieldValue = UserConfigModel.defaultConfigValues

  const { handleSubmit, control, getValues, setValue } = useForm({
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
  const handleClearUsers = () => setValue('readers', [])
  const handleSelectAllUsers = () => setValue('readers', friendsList)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="ConfigForm">
      <ConfigFormFields
        control={control}
        fields={fields}
        onRemove={removeField}
        onCopy={onCopy}
        colors={colors}
        friendsList={friendsList}
        assessmentOptions={assessmentOptions}
        handleAssessmentSearch={handleAssessmentSearch}
        handleClearAssessments={handleClearAssessments}
        handleClearUsers={handleClearUsers}
        handleSelectAllUsers={handleSelectAllUsers}
      />
      <div className="ConfigFormActions">
        <Button
          color="secondary"
          size="small"
          disableElevation
          variant="contained"
          onClick={() => addNewField()}
          sx={{ gridColumnStart: 1, gridColumnEnd: 1 }}
        >
          Add a field
        </Button>
        <Button
          disableElevation
          onClick={handleSubmit(handleSubmitDraft)}
          sx={{
            backgroundColor: 'grey.A400',
            gridColumnStart: 2,
            gridColumnEnd: 2,
            '&:active': {
              backgroundColor: 'grey.A400',
            },
            '&:hover': {
              backgroundColor: 'grey.A200',
            },
          }}
          variant="contained"
          size="small"
        >
          Save as draft
        </Button>
        <Button
          type="submit"
          size="small"
          disableElevation
          sx={{
            backgroundColor: 'primary.dark',
            '&:active': {
              backgroundColor: 'primary.dark',
            },
            gridColumnStart: 3,
            gridColumnEnd: 3,
          }}
          variant="contained"
        >
          Publish
        </Button>
      </div>
    </form>
  )
}

export default ConfigForm
