import { Select } from '@mui/material'
import { Controller } from 'react-hook-form'

const ControlledSelectInput = ({ name, control, value, ...rest }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          {...rest}
          fullWidth
          value={field.value.value || value}
          onChange={(e) => field.onChange({ value: e.target.value })}
        />
      )}
    />
  )
}

export default ControlledSelectInput
