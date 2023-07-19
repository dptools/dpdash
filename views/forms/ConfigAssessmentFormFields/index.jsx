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
  id,
  onCopy,
  onRemove,
  width,
}) => {
  return (
    <ConfigurationCategoryCard
      key={id + 'card'}
      classes={classes}
      formIndex={index}
      onCopy={onCopy}
      onRemove={onRemove}
      rowNum={index + 1}
      width={width}
    >
      <TextInput
        key={id + 'category'}
        control={control}
        name={`config.${index}.category`}
        label="Category"
      />
      <TextInput
        key={id + 'analysis'}
        control={control}
        name={`config.${index}.analysis`}
        label="Assessment"
      />
      <TextInput
        key={id + 'variable'}
        control={control}
        name={`config.${index}.variable`}
        label="Variable"
      />
      <TextInput
        key={id + 'label'}
        control={control}
        name={`config.${index}.label`}
        label="Label"
      />
      <ControlledSelectInput
        key={id + 'color'}
        control={control}
        name={`config.${index}.color`}
        value={221}
      >
        {colors.map(({ value, label }, colorsIndex) => (
          <MenuItem value={value} key={`${id}-${colorsIndex}-${index}`}>
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
          key={id + 'min'}
          control={control}
          fullWidth={false}
          label="Min"
          name={`config.${index}.min`}
        />
        <TextInput
          key={id + 'max'}
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
