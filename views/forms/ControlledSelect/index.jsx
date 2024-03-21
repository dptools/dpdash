import React from 'react'
import { TextField } from '@mui/material'
import { useController } from 'react-hook-form'

const ControlledSelectInput = ({ control, value, name, sx, ...rest }) => {
  const { field } = useController({ name, control })

  return (
    <TextField
      {...rest}
      {...field}
      name={name}
      select
      value={field?.value || value}
      label={rest.label}
      sx={sx || {}}
    />
  )
}

export default ControlledSelectInput
