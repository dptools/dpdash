import React from 'react'
import Delete from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import { IconButton } from '@mui/material'
import Typography from '@mui/material/Typography'
import ColorPicker from '../components/ColorPicker'
import Tooltip from '@mui/material/Tooltip'
import TextInput from './TextInput'
import ControlledCheckbox from './ControlledCheckbox'

import { presetColors } from '../../constants'

const BarChartFields = ({
  control,
  fields,
  onRemove,
  onAddNewFields,
  fieldsValue,
}) => {
  return (
    <>
      <TextInput
        label="Title"
        name="title"
        required
        fullWidth
        control={control}
      />
      <TextInput
        label="Description"
        name="description"
        multiline
        rowsMax={4}
        fullWidth
        required
        control={control}
      />
      <TextInput
        label="Assessment"
        name="assessment"
        required
        fullWidth
        control={control}
      />
      <TextInput
        label="Variable Name"
        name="variable"
        required
        fullWidth
        control={control}
      />
      <div>
        <ControlledCheckbox
          control={control}
          name="public"
          color="default"
          id="public_checkbox"
          aria-label
          label="Public"
        />
      </div>
      {fields.map((field, index) => {
        const { id, targetValues } = field
        return (
          <React.Fragment key={id}>
            <div>
              <Tooltip
                disableFocusListener
                title="Leave blank to count empty values"
              >
                <TextInput
                  label="Value"
                  name={`fieldLabelValueMap.${index}.value`}
                  control={control}
                />
              </Tooltip>
              <TextInput
                label="Label"
                control={control}
                name={`fieldLabelValueMap.${index}.label`}
                required
              />
              <ColorPicker
                control={control}
                name={`fieldLabelValueMap.${index}.color`}
                color={fieldsValue[index].color || field.color}
                presetColors={presetColors}
              />
              <IconButton aria-label="delete" onClick={() => onRemove(index)}>
                <Delete />
              </IconButton>
            </div>
            <div>
              <Typography variant="h6" color="textSecondary">
                Targets
              </Typography>
            </div>
            {Object.keys(targetValues).map((study, idx) => (
              <div key={idx + study}>
                <Typography
                  variant="subtitle1"
                  gutterBottom={false}
                  color="textSecondary"
                >
                  {study}
                </Typography>
                <TextInput
                  control={control}
                  name={`fieldLabelValueMap.${index}.targetValues.${study}`}
                  fullWidth={false}
                />
              </div>
            ))}
            <div>
              <br />
            </div>
          </React.Fragment>
        )
      })}
      <div>
        <Button variant="text" type="button" onClick={() => onAddNewFields()}>
          + Add label and value group combination
        </Button>
      </div>
    </>
  )
}

export default BarChartFields
