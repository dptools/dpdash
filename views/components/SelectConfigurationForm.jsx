import React from 'react'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { TextField } from '@mui/material'

const SelectConfigurationForm = ({
  configurations,
  onChange,
  currentPreference,
}) => {
  return (
    <form autoComplete="off">
      <FormControl>
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
