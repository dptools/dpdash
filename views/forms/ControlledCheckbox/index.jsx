import React from 'react'

import { Checkbox, FormControlLabel } from '@mui/material'
import { Controller } from 'react-hook-form'

const ControlledCheckbox = ({
  name,
  control,
  onChange,
  checked,
  label,
  ...props
}) => {
  return label ? (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              {...props}
              onChange={(e) => {
                field.onChange(e)
                if (onChange) onChange(e)
              }}
              inputProps={{ name, 'aria-label': name }}
              checked={
                !checked && typeof field.value === 'boolean'
                  ? field.value
                  : checked
              }
            />
          )}
        />
      }
      label={label}
      labelPlacement={props.labelplacement || 'start'}
      sx={props.labelprops.sx || {}}
    />
  ) : (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Checkbox
          {...field}
          {...props}
          onChange={(e) => {
            field.onChange(e)
            if (onChange) onChange(e)
          }}
          inputProps={{ name, 'aria-label': name }}
          defaultChecked={
            !checked && typeof field.value === 'boolean' ? field.value : checked
          }
        />
      )}
    />
  )
}

export default ControlledCheckbox
