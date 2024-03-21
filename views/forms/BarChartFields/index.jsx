import React from 'react'
import Delete from '@mui/icons-material/Delete'
import { Button, Typography } from '@mui/material'
import ColorPicker from '../../components/ColorPicker/'
import TextInput from '../TextInput'
import ControlledCheckbox from '../ControlledCheckbox'

import { presetColors } from '../../../constants'

import './BarChartFields.css'

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
              <Button
                aria-label="delete"
                onClick={() => onRemove(index)}
                endIcon={<Delete />}
                variant="outline"
              >
                Delete Targets
              </Button>
            </div>
            <div className="BarChartFieldsValueLabel">
              <TextInput
                label="Value"
                name={`fieldLabelValueMap.${index}.value`}
                control={control}
                size="small"
                fullWidth={false}
              />
              <TextInput
                label="Label"
                control={control}
                name={`fieldLabelValueMap.${index}.label`}
                required
                size="small"
                fullWidth={false}
              />
            </div>
            <ColorPicker
              control={control}
              name={`fieldLabelValueMap.${index}.color`}
              color={fieldsValue[index].color || field.color}
              presetColors={presetColors}
            />
            <Typography variant="h6" color="textSecondary" sx={{ py: '20px' }}>
              Targets
            </Typography>
            {Object.keys(targetValues).map((study, idx) => (
              <div key={idx + study} className="BarChartFieldsTargetValues">
                <Typography
                  variant="subtitle1"
                  gutterBottom={false}
                  color="textSecondary"
                  sx={{ pr: '10px' }}
                >
                  {study}
                </Typography>
                <TextInput
                  control={control}
                  name={`fieldLabelValueMap.${index}.targetValues.${study}`}
                  fullWidth={false}
                  size="small"
                  margin="dense"
                />
              </div>
            ))}
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
