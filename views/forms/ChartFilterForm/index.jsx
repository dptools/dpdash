import React from 'react'
import { useForm } from 'react-hook-form'
import { Button, List, ListItem, Typography } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { FILTER_CATEGORIES, TRUE_STRING } from '../../../constants'
import ControlledCheckbox from '../ControlledCheckbox'
import ControlledMultiSelect from '../ControlledMultiSelect'

import './ChartFilterForm.css'

const schema = yup.object({
  sites: yup.array().min(1, 'You must select at least 1 site'),
})

const ChartFilterForm = ({ initialValues, onSubmit, siteOptions }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="ChartFilterForm">
        {Object.keys(initialValues)
          .filter((key) => key !== 'sites')
          .map((filterKey) => {
            return (
              <div key={filterKey}>
                <Typography variant="subtitle2">
                  {FILTER_CATEGORIES[filterKey]}
                </Typography>
                <div className="ChartFilterForm_container">
                  {initialValues[filterKey].map((filter, index) => {
                    const filterID = `${filterKey}-${filter.name}`

                    return (
                      <List key={filterID} component="div" disablePadding>
                        <ListItem className="ChartFilterForm_nested">
                          <ControlledCheckbox
                            checked={filter.value === TRUE_STRING}
                            control={control}
                            name={`${filterKey}.${index}.value`}
                            id={filterID}
                            label={filter.name}
                          />
                        </ListItem>
                      </List>
                    )
                  })}
                </div>
              </div>
            )
          })}
      </div>
      <div>
        <ControlledMultiSelect
          label="Sites"
          name="sites"
          control={control}
          options={siteOptions}
          placeholder="Select sites to view data"
          fullWidth
        />
      </div>
      <div className="ChartFilterForm_submit">
        <Button type="submit" color="primary" variant="contained">
          Apply Filters
        </Button>
      </div>
    </form>
  )
}

export default ChartFilterForm
