import React, { useEffect } from 'react'

import { FormControl, InputLabel } from '@mui/material'
import { useForm } from 'react-hook-form'

import {
  SITES_BY_NETWORK,
  NETWORKS_FILTER_KEY,
  SITES_FILTER_KEY,
  FILTER_CATEGORIES,
} from '../../../constants'
import { ChartFiltersModel } from '../../models'
import DropdownCheckboxGroup from '../DropdownCheckboxGroup'

import './ChartFilterForm.css'

const ChartFilterForm = ({ initialValues, onSubmit }) => {
  const { handleSubmit, setValue, watch, control } = useForm({
    defaultValues: ChartFiltersModel.filtersToFormValues(initialValues),
  })
  const handleClear = (filterField) => setValue(filterField, [])
  const handleSelectAll = (filterField) => {
    const allFilterValues = Object.values(initialValues[filterField]).map(
      ({ label }) => label
    )
    return setValue(filterField, allFilterValues)
  }

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === NETWORKS_FILTER_KEY) {
        const sitesUnion = [
          ...new Set(
            value[NETWORKS_FILTER_KEY].reduce((siteList, network) => {
              return siteList.concat(SITES_BY_NETWORK[network])
            }, [])
          ),
        ]

        setValue(SITES_FILTER_KEY, sitesUnion)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="filter_form">
      <div className="ChartFilterForm">
        {Object.keys(initialValues).map((filterKey, i) => {
          const columnStart = (i % 4) + 1
          const row = Math.trunc(i / 4) + 1

          return (
            <FormControl
              key={filterKey}
              sx={{
                gridColumnStart: columnStart,
                gridColumnEnd: columnStart,
                gridRowStart: row,
              }}
            >
              <InputLabel
                id={`multi-chip-label-${filterKey}`}
                data-testid={`multi-chip-label-${filterKey}`}
              >
                {FILTER_CATEGORIES[filterKey]}
              </InputLabel>
              <DropdownCheckboxGroup
                control={control}
                label={filterKey}
                name={filterKey}
                initialValues={initialValues[filterKey]}
                onClear={handleClear}
                onSelectAll={handleSelectAll}
                onClose={handleSubmit(onSubmit)}
              />
            </FormControl>
          )
        })}
      </div>
    </form>
  )
}

export default ChartFilterForm
