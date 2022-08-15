import React from 'react'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'

const SelectConfigurationForm = ({
  configurations,
  onChange,
  currentPreference,
  classes,
}) => {
  return (
    <form autoComplete='off' className={classes.configForm}>
      <FormControl className={classes.configFormControl}>
        <Select
          value={currentPreference.config}
          onChange={(e) => onChange(e.target.value)}
          inputProps={{
            name: 'config',
            id: 'config',
          }}
        >
          {configurations.map((configuration) => (
            <MenuItem key={configuration._id} value={configuration._id}>
              {configuration.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </form>
  )
}

export default SelectConfigurationForm
