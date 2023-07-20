import React from 'react'
import TextInput from '../TextInput'
import ControlledReactSelect from '../ControlledReactSelect'

const ConfigTypeFormFields = (props) => {
  const { control, friendsList, classes } = props

  return (
    <>
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
      />
      <ControlledReactSelect
        name="readers"
        classes={classes}
        control={control}
        options={friendsList}
        placeholder="Shared with"
        isMulti
      />
    </>
  )
}

export default ConfigTypeFormFields
