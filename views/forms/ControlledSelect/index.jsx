import { Select } from '@material-ui/core'
import { Controller } from 'react-hook-form'

const ControlledSelectInput = ({ children, name, control, value, ...rest }) => {
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
        >
          {children}
        </Select>
      )}
    />
  )
}

export default ControlledSelectInput
