import React from 'react'

import { Autocomplete, TextField } from '@mui/material'
import { useController } from 'react-hook-form'

const PredictiveInputSelect = ({ control, options, name, ...rest }) => {
  const { field } = useController({ name, control })

  return (
    <Autocomplete
      freeSolo
      options={options}
      name={name}
      {...field}
      onBlur={(e) => {
        if (rest.onBlur) rest.onBlur(e)

        field.onBlur(e)
      }}
      onChange={(e, selectedValue) => {
        if (rest.onChange) rest.onChange(e)

        field.onChange(selectedValue)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...rest}
          label={rest.label}
          name={name}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => {
            if (rest.onChange) rest.onChange(e)

            field.onChange(e.target.value)
          }}
          onBlur={(e) => {
            if (rest.onBlur) rest.onBlur(e)

            field.onBlur(e)
          }}
        />
      )}
    />
  )
}

export default PredictiveInputSelect
