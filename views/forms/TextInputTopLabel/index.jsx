import React from 'react'
import { InputLabel, FormHelperText, OutlinedInput } from '@mui/material/'
import { useController } from 'react-hook-form'

import { lineHeight, fontSize, borderRadius } from '../../../constants'

const TextInputTopLabel = (props) => {
  const {
    field,
    formState: { errors },
  } = useController(props)

  return (
    <>
      <InputLabel
        {...props?.inputLabel}
        aria-label={props.label}
        shrink
        sx={{
          color: 'text.primary',
          fontWeight: 500,
          lineHeight: lineHeight[21],
          fontSize: fontSize[18],
          ...props.inputLabel?.sx,
        }}
        required={props.required}
        htmlFor={props.name}
      >
        {props.label}
      </InputLabel>
      <OutlinedInput
        {...field}
        id={props.name}
        fullWidth={props.fullWidth}
        error={!!errors[props.name]}
        inputProps={props.inputProps}
        margin={props.margin || 'none'}
        required={props.required}
        type={props.type}
        sx={{ borderRadius: borderRadius[8], ...props.sx }}
        size={props.size}
        disabled={props.disabled}
      />
      {!!errors[props.name] && (
        <FormHelperText
          aria-label={`${props.name}-error`}
          error
          sx={{ mb: '20px', mt: '-20px' }}
        >
          {errors[props.name].message}
        </FormHelperText>
      )}
    </>
  )
}

export default TextInputTopLabel
