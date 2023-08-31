import React, { useState } from 'react'
import Button from '@material-ui/core/Button'

import Form from './Form'
import BarChartFields from './BarChartFields'

const ChartForm = ({ classes, handleSubmit, studies, initialValues }) => {
  const [formValues, setFormValues] = useState(initialValues)

  return (
    <Form onSubmit={(e) => handleSubmit(e, formValues)}>
      <BarChartFields
        classes={classes}
        formValues={formValues}
        setFormValues={setFormValues}
        studies={studies}
      />
      <div className={classes.submitButtonContainer}>
        <Button
          type='submit'
          variant='contained'
          className={classes.textButton}
        >
          Submit Form
        </Button>
      </div>
    </Form>
  )
}

export default ChartForm
