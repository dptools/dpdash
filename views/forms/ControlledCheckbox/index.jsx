import React from 'react'
import { Controller } from 'react-hook-form'
import { Checkbox } from '@mui/material'

const ControlledCheckbox = ({ name, control, onChange, checked }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Checkbox
          {...field}
          onChange={(e) => {
            field.onChange(e)
            if (onChange) onChange(e)
          }}
          inputProps={{ name, 'aria-label': name }}
          defaultChecked={checked}
        />
      )}
    />
  )
}

export default ControlledCheckbox
