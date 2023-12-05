import React from 'react'
import { Controller } from 'react-hook-form'
import { MultiSelect } from '../MultiSelect'

const ControlledMultiSelect = (props) => {
  const onChange = (value, reason, field) => {
    switch (reason) {
      case 'clear':
        value = field.value.filter(({ isFixed }) => isFixed)

        return field.onChange(value)
      case 'removeOption':
        const optionToRemove = field.value.filter(
          (prevOption) =>
            !value.find(
              (currentOption) => currentOption.value === prevOption.value
            )
        )
        if (!optionToRemove[0]?.isFixed) {
          field.onChange(value)
        }
        break
      default:
        return field.onChange(value)
    }
  }

  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field, fieldState }) => (
        <MultiSelect field={field} fieldState={fieldState} onChange={onChange} {...props}></MultiSelect> 
      )}
    />
  )
}

export default ControlledMultiSelect
