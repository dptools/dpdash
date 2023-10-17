import React from 'react'
import { InputLabel, Typography } from '@material-ui/core'
import TextInput from '../TextInput'
import ControlledReactSelect from '../ControlledReactSelect'
import ControlledCheckbox from '../ControlledCheckbox'

const ConfigTypeFormFields = (props) => {
  const { control, friendsList, classes } = props

  return (
    <div className={classes.configurationInputContainer}>
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
      <div className={classes.formLabelRow}>
        <InputLabel htmlFor="public_checkbox" className={classes.publicText}>
          Public
        </InputLabel>
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
        classes={classes}
        control={control}
        options={friendsList}
        placeholder="Shared with"
        isMulti
      />
    </div>
  )
}

export default ConfigTypeFormFields
