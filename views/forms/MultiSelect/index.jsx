import React from 'react'

import { Autocomplete, Chip, TextField } from '@mui/material'

import MultiSelectFooterActions from './MultiSelectActions'

export const MultiSelect = (props) => {
  const { field, fieldState } = props

  return (
    <Autocomplete
      id={props.name}
      data-testid={props.name}
      fullWidth={props.fullWidth}
      getOptionDisabled={(option) => option.isFixed}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      multiple
      onChange={(_, data, reason) => props.onChange(data, reason, field)}
      options={props.options}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            key={`${field}-chip-${index}`}
            label={option.label}
            {...getTagProps({ index })}
            disabled={option.isFixed}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          aria-invalid={fieldState?.error ? 'true' : 'false'}
          label={props.label}
          helperText={fieldState?.error?.message}
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
      value={props.value || field.value}
      sx={props.sx || {}}
      componentsProps={{
        paper: {
          onClear: props.onClear || {},
          onSelectAll: props.onSelectAll || {},
        },
      }}
      PaperComponent={props.displayActions ? MultiSelectFooterActions : null}
    />
  )
}
