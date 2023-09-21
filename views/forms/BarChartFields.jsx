import React from 'react'
import Delete from '@material-ui/icons/Delete'
import Button from '@material-ui/core/Button'
import { IconButton } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import ColorPicker from '../components/ColorPicker'
import InputLabel from '@material-ui/core/InputLabel'
import Tooltip from '@material-ui/core/Tooltip'
import TextInput from './TextInput'
import ControlledCheckbox from './ControlledCheckbox'

import { presetColors } from '../../constants'

const BarChartFields = ({
  classes,
  control,
  fields,
  onRemove,
  onAddNewFields,
  fieldsValue,
}) => {
  return (
    <>
      <TextInput
        className={classes.textInput}
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
        className={classes.textInput}
        fullWidth
        required
        control={control}
      />
      <TextInput
        className={classes.textInput}
        label="Assessment"
        name="assessment"
        required
        fullWidth
        control={control}
      />
      <TextInput
        label="Variable Name"
        name="variable"
        className={classes.textInput}
        required
        fullWidth
        control={control}
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
      {fields.map((field, index) => {
        const { id, targetValues } = field
        return (
          <React.Fragment key={id}>
            <div className={classes.formLabelRow}>
              <Tooltip
                disableFocusListener
                title="Leave blank to count empty values"
              >
                <TextInput
                  label="Value"
                  name={`fieldLabelValueMap.${index}.value`}
                  className={`
                ${classes.formLabelCol}
                ${classes.variableListInput}
              `}
                  control={control}
                />
              </Tooltip>
              <TextInput
                label="Label"
                control={control}
                name={`fieldLabelValueMap.${index}.label`}
                className={classes.variableListInput}
                required
              />
              <ColorPicker
                control={control}
                classes={classes}
                name={`fieldLabelValueMap.${index}.color`}
                color={fieldsValue[index].color || field.color}
                presetColors={presetColors}
              />
              <IconButton
                aria-label="delete"
                onClick={() => onRemove(index)}
                className={classes.deleteContainer}
              >
                <Delete className={classes.icons} />
              </IconButton>
            </div>
            <div className={classes.formLabelRow}>
              <Typography variant="h6" color="textSecondary">
                Targets
              </Typography>
            </div>
            {Object.keys(targetValues).map((study, idx) => (
              <div key={idx + study} className={classes.formLabelRow}>
                <Typography
                  variant="subtitle1"
                  gutterBottom={false}
                  color="textSecondary"
                  className={classes.targetValueContainer}
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
            <div className={classes.formLabelRow}>
              <br />
            </div>
          </React.Fragment>
        )
      })}
      <div className={classes.addLabelContainer}>
        <Button
          variant="text"
          type="button"
          className={classes.textButton}
          onClick={() => onAddNewFields()}
        >
          + Add label and value group combination
        </Button>
      </div>
    </>
  )
}

export default BarChartFields
