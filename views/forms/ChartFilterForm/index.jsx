import React from 'react'
import { useForm } from 'react-hook-form'
import DropdownCheckboxGroup from '../DropdownCheckboxGroup'

import './ChartFilterForm.css'
import { Button } from '@mui/material'

const ChartFilterForm = ({ initialValues, onSubmit }) => {
  const { handleSubmit, setValue } = useForm({
    defaultValues: initialValues,
  })

  const handleChange = (label, value) => {
    const newFilterValues = Object.keys(initialValues[label]).reduce((acc, key) => {
      acc[key] = value.includes(key) ? { label: key, value: 1 } : { label: key, value: 0 }
      return acc
    }, {})
    setValue(label, newFilterValues)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="filter_form">
      <div className="ChartFilterForm">
        {Object.keys(initialValues).map((filterKey) => {
          return (
            <DropdownCheckboxGroup
              label={filterKey}
              initialValues={initialValues[filterKey]}
              onChange={handleChange}
            />
          )
        })}
      </div>
      <Button type="submit">Set Filters</Button>
    </form>
  )
}

export default ChartFilterForm
