import React from 'react'
import { useForm } from 'react-hook-form'
import { Button, FormControl, InputLabel } from '@mui/material'
import DropdownCheckboxGroup from '../DropdownCheckboxGroup'
import { FILTER_CATEGORIES } from '../../../constants/vars'

import './ChartFilterForm.css'

const ChartFilterForm = ({ initialValues, onSubmit }) => {
  const { handleSubmit, setValue } = useForm({
    defaultValues: initialValues,
  })

  const handleChange = (label, value) => {
    const newFilterValues = Object.keys(initialValues[label]).reduce(
      (acc, key) => {
        acc[key] = value.includes(key)
          ? { label: key, value: 1 }
          : { label: key, value: 0 }
        return acc
      },
      {}
    )
    setValue(label, newFilterValues)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="filter_form">
      <div className="ChartFilterForm">
        {Object.keys(initialValues).map((filterKey, i) => {
          return (
            <FormControl
              sx={{
                gridColumnStart: i,
                gridColumnEnd: i + 1,
                width: '275px',
              }}
            >
              <InputLabel id={`multi-chip-label-${filterKey}`}>
                {FILTER_CATEGORIES[filterKey]}
              </InputLabel>
              <DropdownCheckboxGroup
                label={filterKey}
                initialValues={initialValues[filterKey]}
                onChange={handleChange}
              />
            </FormControl>
          )
        })}
      </div>
      <Button type="submit">Set Filters</Button>
    </form>
  )
}

export default ChartFilterForm
