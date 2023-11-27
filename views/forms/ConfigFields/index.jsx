import React from 'react'
import { Grid } from '@mui/material'
import ConfigAssessmentFormFields from '../ConfigAssessmentFormFields'
import ConfigTypeFormFields from '../ConfigTypeFormFields'

const ConfigFormFields = ({
  control,
  colors,
  fields,
  friendsList,
  onCopy,
  onRemove,
}) => {
  return (
    <React.Fragment>
      <ConfigTypeFormFields control={control} friendsList={friendsList} />
      <Grid container columnSpacing={1} rowSpacing={3}>
        {fields.map((field, index) => {
          const { id, ...rest } = field

          return (
            <Grid item xs={12} md={5} lg={4} key={id}>
              <ConfigAssessmentFormFields
                colors={colors}
                control={control}
                index={index}
                id={id}
                onCopy={onCopy}
                onRemove={onRemove}
                {...rest}
              />
            </Grid>
          )
        })}
      </Grid>
    </React.Fragment>
  )
}

export default ConfigFormFields
