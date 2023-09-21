import React from 'react'
import Button from '@material-ui/core/Button'

import Form from './Form'
import BarChartFields from './BarChartFields'

const ChartForm = ({ classes, onSubmit, fields, control, ...rest }) => {
  return (
    <Form onSubmit={onSubmit}>
      <BarChartFields
        classes={classes}
        control={control}
        fields={fields}
        {...rest}
      />
      <div className={classes.submitButtonContainer}>
        <Button
          type="submit"
          variant="contained"
          className={classes.textButton}
        >
          Submit Form
        </Button>
      </div>
    </Form>
  )
}

export default ChartForm
