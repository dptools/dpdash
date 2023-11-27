import React from 'react'
import { Controller } from 'react-hook-form'
import { Autocomplete, Chip, TextField } from '@mui/material'

const ControlledMultiSelect = (props) => {
  const onChange = (value, reason, field) => {
    switch (reason) {
      case 'clear':
        value = field.value.filter(({ isFixed }) => isFixed)

        return field.onChange(value)
      case 'removeOption':
        const optionToRemove = field.value.filter(
          (prevOption) =>
            !value.find(
              (currentOption) => currentOption.value === prevOption.value
            )
        )
        if (!optionToRemove[0]?.isFixed) {
          field.onChange(value)
        }
        break
      default:
        return field.onChange(value)
    }
  }

  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field, fieldState }) => (
        <Autocomplete
          id={props.name}
          fullWidth={props.fullWidth}
          getOptionDisabled={(option) => option.isFixed}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          multiple
          onChange={(_, data, reason) => onChange(data, reason, field)}
          options={props.options}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                label={option.label}
                {...getTagProps({ index })}
                disabled={option.isFixed}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              aria-invalid={!!fieldState.error ? 'true' : 'false'}
              label={props.label}
              helperText={fieldState.error?.message}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    {props.startAdornment}
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
              placeholder={props.placeholder}
            />
          )}
          value={field.value}
        />
      )}
    />
  )
}

export default ControlledMultiSelect
