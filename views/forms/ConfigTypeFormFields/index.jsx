import React from 'react'

import { FormHelperText, InputLabel } from '@mui/material'

import { fontSize, lineHeight } from '../../../constants'
import ControlledCheckbox from '../ControlledCheckbox'
import ControlledMultiSelect from '../ControlledMultiSelect'
import TextInput from '../TextInput'

import './ConfigTypeFormFields.css'

const textInputStyles = {
  color: 'text.primary',
  fontWeight: 500,
  lineHeight: lineHeight[21],
  fontSize: fontSize[18],
  mt: '-10px',
}
const textInputProps = { notched: false }
const inputLabelProps = { shrink: true, sx: textInputStyles }

const ConfigTypeFormFields = (props) => {
  const { control, friendsList, handleClearUsers, handleSelectAllUsers } = props

  return (
    <div className="ConfigTypeFormFields">
      <TextInput
        control={control}
        name="configName"
        sx={{
          gridArea: 'name',
        }}
        label="Configuration name"
        InputLabelProps={inputLabelProps}
        InputProps={textInputProps}
      />
      <TextInput
        control={control}
        name="configType"
        sx={{
          gridArea: 'type',
        }}
        label="Type"
        InputLabelProps={inputLabelProps}
        InputProps={textInputProps}
        disabled
      />
      <TextInput
        control={control}
        name="description"
        sx={{
          gridArea: 'description',
        }}
        label="Description (Optional)"
        InputLabelProps={inputLabelProps}
        InputProps={textInputProps}
      />
      <div className="ConfigTypeShareContainer">
        <div className="ConfigTypeShareHeader">
          <InputLabel
            aria-label="readers"
            shrink
            sx={{
              color: 'text.primary',
              fontWeight: 500,
              lineHeight: lineHeight[21],
              fontSize: fontSize[18],
              gridColumnStart: 1,
              gridColumnEnd: 1,
              gridArea: 'share_label',
            }}
          >
            Share with
          </InputLabel>
          <ControlledCheckbox
            control={control}
            name="public"
            id="public_checkbox"
            aria-label
            label="Make configuration public"
            labelplacement="end"
            sx={{
              gridColumnStart: 2,
              gridColumnEnd: 2,
              color: 'primary.light',
              '&.Mui-checked': {
                color: 'primary.light',
              },
              gridArea: 'make_public',
            }}
            labelprops={{ sx: { height: '20px', mt: '-5px' } }}
          />
        </div>
        <ControlledMultiSelect
          name="readers"
          control={control}
          options={friendsList}
          onClear={handleClearUsers}
          onSelectAll={handleSelectAllUsers}
          displayActions
          isMulti
        />
        <FormHelperText sx={{ color: 'black.A100' }}>
          Added users will have view only access to this configuration.
        </FormHelperText>
      </div>
    </div>
  )
}

export default ConfigTypeFormFields
