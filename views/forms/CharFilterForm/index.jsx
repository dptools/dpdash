import React from 'react'
import {
  Button,
  List,
  ListItem,
  Typography,
  InputLabel,
} from '@material-ui/core'
import Form from '../Form'
import { FILTER_CATEGORIES, TRUE_STRING } from '../../../constants'
import ControlledCheckbox from '../ControlledCheckbox'
import ControlledReactSelect from '../ControlledReactSelect'

const ChartFilterForm = ({
  initialValues,
  onSubmit,
  classes,
  control,
  siteOptions,
}) => {
  return (
    <Form onSubmit={onSubmit}>
      <div className={classes.filterForm}>
        {Object.keys(initialValues)
          .filter((key) => key !== 'sites')
          .map((filterKey) => {
            return (
              <div key={filterKey}>
                <Typography variant="subtitle2" className={classes.filterText}>
                  {FILTER_CATEGORIES[filterKey]}
                </Typography>
                <div className={classes.filtersContainer}>
                  {initialValues[filterKey].map((filter, index) => {
                    const filterID = `${filterKey}-${filter.name}`

                    return (
                      <List key={filterID} component="div" disablePadding>
                        <ListItem className={classes.filterNested}>
                          <InputLabel
                            htmlFor={filterID}
                            className={classes.filterLabel}
                          >
                            {filter.name}
                          </InputLabel>
                          <ControlledCheckbox
                            checked={filter.value === TRUE_STRING}
                            control={control}
                            name={`${filterKey}.${index}.value`}
                            id={filterID}
                            className={classes.filterCheckbox}
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
        <Typography variant="subtitle2" className={classes.filterText}>
          Sites
        </Typography>
        <ControlledReactSelect
          name="sites"
          classes={classes}
          control={control}
          options={siteOptions}
          placeholder="Select a site to view data"
          isMulti
        />
      </div>
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
