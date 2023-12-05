import React from 'react'
import { Typography } from '@mui/material'
import TextInput from '../TextInput'
import ControlledMultiSelect from '../ControlledMultiSelect'
import ControlledCheckbox from '../ControlledCheckbox'

import './ConfigTypeFormFields.css'

const ConfigTypeFormFields = (props) => {
  const { control, friendsList } = props

  return (
    <div className="ConfigTypeFormFields">
      <TextInput
        name="configName"
        label="Configuration Name"
        margin="normal"
        control={control}
        required
        fullWidth
      />
      <TextInput
        name="configType"
        control={control}
        disabled={true}
        value="matrix"
        label="matrix"
        fullWidth
      />
      <Typography variant="subtitle2">Shared with:</Typography>
      <ControlledMultiSelect
        name="readers"
        control={control}
        options={friendsList}
        isMulti
      />
      <div style={{ paddingTop: '15px' }}>
        <ControlledCheckbox
          control={control}
          name="public"
          color="default"
          id="public_checkbox"
          label="Public"
          aria-label
        />
      </div>
    </div>
  )
}

export default ConfigTypeFormFields
