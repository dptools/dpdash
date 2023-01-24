import React, { useState } from 'react'
import {
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  InputLabel,
} from '@material-ui/core'
import Form from '../Form'
import {
  FILTER_CATEGORIES,
  TRUE_STRING,
  FALSE_STRING,
} from '../../../constants'

const ChartFilterForm = ({ initialValues, onSubmit, classes }) => {
  const [values, setValues] = useState(initialValues)
  const onChange = (target, filterKey) => {
    setValues({
      ...values,
      [filterKey]: values[filterKey].map((filter) =>
        filter.name === target.name
          ? {
              ...filter,
              value: filter.value === TRUE_STRING ? FALSE_STRING : TRUE_STRING,
            }
          : filter
      ),
    })
  }

  return (
    <Form
      handleSubmit={(e) => {
        e.preventDefault()
        return onSubmit(values)
      }}
    >
      {Object.keys(values).map((filterKey) => {
        return (
          <List
            id={filterKey}
            key={filterKey}
            component="nav"
            className={classes.filters}
          >
            <ListItemText
              primary={FILTER_CATEGORIES[filterKey]}
              className={classes.filterText}
            />
            <div className={classes.filtersContainer}>
              {values[filterKey].map((filter) => {
                const filterID = `${filterKey}-${filter.name}`

                return (
                  <List key={filterID} component="div" disablePadding>
                    <ListItem className={classes.filterNested}>
                      <InputLabel htmlFor={filterID}>
                        {filter.name}
                        <Checkbox
                          checked={filter.value === TRUE_STRING}
                          onChange={({ target }) => onChange(target, filterKey)}
                          name={filter.name}
                          id={filterID}
                        />
                      </InputLabel>
                    </ListItem>
                  </List>
                )
              })}
            </div>
          </List>
        )
      })}
      <div className={classes.filterButtonContainer}>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          className={classes.submitFiltersButton}
        >
          Apply Filters
        </Button>
      </div>
    </Form>
  )
}

export default ChartFilterForm
