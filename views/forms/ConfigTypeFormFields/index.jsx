import React from 'react'
import { InputLabel, Typography } from '@mui/material'
import TextInput from '../TextInput'
import ControlledReactSelect from '../ControlledReactSelect'
import ControlledCheckbox from '../ControlledCheckbox'

const ConfigTypeFormFields = (props) => {
  const { control, friendsList } = props

  return (
    <div>
      <TextInput
        name="configName"
        placeholder="Configuration Name"
        margin="normal"
        control={control}
      />
      <TextInput
        name="configType"
        control={control}
        disabled={true}
        value={'matrix'}
        placeholder={'matrix'}
        fullWidth={false}
      />
      <div>
        <InputLabel htmlFor="public_checkbox">Public</InputLabel>
        <ControlledCheckbox
          control={control}
          name="public"
          color="default"
          id="public_checkbox"
          aria-label
        />
      </div>
      <Typography variant="subtitle2">Shared with:</Typography>
      <ControlledReactSelect
        name="readers"
        control={control}
        options={friendsList}
        placeholder="Shared with"
        isMulti
      />
    </div>
  )
}

export default ConfigTypeFormFields
