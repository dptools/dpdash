import React from 'react'
import { useForm } from 'react-hook-form'
import DropdownCheckboxGroup from '../DropdownCheckboxGroup'

import './ChartFilterForm.css'

const ChartFilterForm = ({ initialValues, onSubmit }) => {
  const { handleSubmit, control, getValues } = useForm({
    defaultValues: initialValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="filter_form">
      <div className="ChartFilterForm">
        {Object.keys(initialValues).map((filterKey) => {
          return (
            <DropdownCheckboxGroup
              filterKey={filterKey}
              control={control}
              options={Object.values(initialValues[filterKey])}
              onSubmit={onSubmit}
              getValues={getValues}
            />
          )
        })}
      </div>
    </form>
  )
}

export default ChartFilterForm
