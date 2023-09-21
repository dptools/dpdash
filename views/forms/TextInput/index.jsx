import TextField from '@material-ui/core/TextField'
import { Controller } from 'react-hook-form'

const TextInput = (props) => {
  const { name, control, onChange, ...rest } = props

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          fullWidth={true}
          margin="dense"
          {...field}
          {...rest}
          onChange={(e) => {
            field.onChange(e)

            if (onChange) onChange(e)
          }}
        />
      )}
    />
  )
}

export default TextInput
