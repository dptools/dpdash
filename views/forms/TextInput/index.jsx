import React from 'react'
import TextField from '@mui/material/TextField'
import { useController } from 'react-hook-form'

const TextInput = (props) => {
  const { errors } = props
  const { field } = useController(props)

  return (
    <TextField
      aria-invalid={!!errors ? 'true' : 'false'}
      aria-label={props.label}
      fullWidth={props.fullWidth}
      helperText={errors?.message}
      InputLabelProps={{ shrink: true }}
      inputProps={props.inputProps}
      label={props.label}
      margin={props.margin || 'normal'}
      required={props.required}
      type={props.type || 'text'}
      placeholder={props.placeholder}
      sx={props.sx}
      size={props.size}
      disabled={props.disabled}
      {...field}
      onChange={(e) => {
        props.onChange?.(e)

        field.onChange(e)
      }}
    />
  )
}

export default TextInput
