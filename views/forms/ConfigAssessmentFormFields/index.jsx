import React from 'react'
import { MenuItem } from '@material-ui/core'
import ConfigurationCategoryCard from '../../components/ConfigurationCategoryCard'
import TextInput from '../TextInput'
import ControlledSelectInput from '../ControlledSelect'

const ConfigAssessmentFormFields = ({
  classes,
  control,
  colors,
  index,
  width,
  onCopy,
  onRemove,
}) => {
  return (
    <ConfigurationCategoryCard
      classes={classes}
      formIndex={index}
      onCopy={onCopy}
      onRemove={onRemove}
      rowNum={index + 1}
      width={width}
    >
      <TextInput
        control={control}
        name={`config.${index}.category`}
        label="Category"
      />
      <TextInput
        control={control}
        name={`config.${index}.analysis`}
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
      >
        {colors.map(({ value, label }, index) => (
          <MenuItem value={value} key={index + value}>
            <div className={classes.configPaletteContainer}>
              {label.map((palette) => (
                <span
                  className={classes.configColorBlock}
                  style={{
                    backgroundColor: palette,
                  }}
                ></span>
              ))}
            </div>
          </MenuItem>
        ))}
      </ControlledSelectInput>
      <div>
        <TextInput
          control={control}
          fullWidth={false}
          label="Min"
          name={`config.${index}.min`}
        />
        <TextInput
          control={control}
          fullWidth={false}
          label="Max"
          name={`config.${index}.max`}
        />
      </div>
    </ConfigurationCategoryCard>
  )
}

export default ConfigAssessmentFormFields
