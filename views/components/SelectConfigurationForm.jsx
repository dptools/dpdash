import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import { TextField } from '@material-ui/core'

const SelectConfigurationForm = ({
  configurations,
  onChange,
  currentPreference,
  classes,
}) => {
  return (
    <form autoComplete="off" className={classes.configForm}>
      <FormControl className={classes.configFormControl}>
        <TextField
          select
          label="Configurations"
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
        </TextField>
      </FormControl>
    </form>
  )
}

export default SelectConfigurationForm
