import React from 'react'

import { VisibilityOffOutlined, Visibility } from '@mui/icons-material'
import { MenuItem } from '@mui/material'

import ConfigurationCategoryCard from '../../components/ConfigurationCategoryCard'
import ControlledCheckbox from '../ControlledCheckbox'
import ControlledSelectInput from '../ControlledSelect'
import PredictiveInputSelect from '../PredictiveInputSelect'
import TextInput from '../TextInput'
import './ConfigAssessmentFormFields.css'

const ConfigAssessmentFormFields = ({
  control,
  colors,
  index,
  id,
  onCopy,
  onRemove,
  assessmentOptions,
  handleAssessmentSearch,
  handleClearAssessments,
}) => {
  return (
    <ConfigurationCategoryCard
      formIndex={index}
      onCopy={onCopy}
      onRemove={onRemove}
      rowNum={index + 1}
    >
      <TextInput
        control={control}
        name={`config.${index}.category`}
        label="Category"
        fullWidth
      />
      <PredictiveInputSelect
        control={control}
        name={`config.${index}.analysis`}
        onChange={handleAssessmentSearch}
        onBlur={handleClearAssessments}
        options={assessmentOptions}
        label="Assessment"
      />
      <TextInput
        control={control}
        name={`config.${index}.variable`}
        label="Variable"
      />
      <TextInput
        control={control}
        name={`config.${index}.label`}
        label="Label"
      />
      <ControlledSelectInput
        control={control}
        name={`config.${index}.color`}
        value={221}
        fullWidth
      >
        {colors.map(({ value, label }, colorsIndex) => (
          <MenuItem value={value} key={`${id}-${colorsIndex}-${index}`}>
            <div className="ColorPaletteDropdown">
              {label.map((palette) => (
                <span
                  key={palette}
                  style={{ backgroundColor: palette }}
                  className="ColorPaletteBlock"
                />
              ))}
            </div>
          </MenuItem>
        ))}
      </ControlledSelectInput>
      <div className="RangeFields">
        <TextInput
          control={control}
          fullWidth={false}
          label="Min"
          name={`config.${index}.min`}
          size="small"
        />
        <TextInput
          control={control}
          fullWidth={false}
          label="Max"
          name={`config.${index}.max`}
          size="small"
        />
      </div>
      <ControlledCheckbox
        control={control}
        name={`config.${index}.text`}
        label="Display value"
        labelplacement="end"
        icon={<VisibilityOffOutlined />}
        checkedIcon={<Visibility />}
        labelprops={{}}
      />
    </ConfigurationCategoryCard>
  )
}

export default ConfigAssessmentFormFields
