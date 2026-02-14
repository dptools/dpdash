import React from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { MenuItem } from '@mui/material'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import ControlledSelect from '../ControlledSelect'

const schema = yup.object({
  config: yup.string().required(),
})
const SelectConfigurationsForm = ({
  configurations,
  onSubmit,
  initialValues,
}) => {
  const { handleSubmit, control } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ControlledSelect
        control={control}
        name="config"
        label="Select configuration"
        SelectProps={{ onClose: handleSubmit(onSubmit) }}
      >
        {configurations.map((configuration) => (
          <MenuItem key={configuration._id} value={configuration._id}>
            {configuration.name}
          </MenuItem>
        ))}
      </ControlledSelect>
    </form>
  )
}

export default SelectConfigurationsForm
