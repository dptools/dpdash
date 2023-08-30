import { Controller } from 'react-hook-form'
import { Checkbox } from '@material-ui/core'

const ControlledCheckbox = (props) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field }) => (
        <Checkbox
          checked={field.value}
          onChange={(e) => {
            field.onChange(e)
            props.onChange()
          }}
        />
      )}
    />
  )
}

export default ControlledCheckbox
