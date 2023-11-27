import React from 'react'
import Button from '@mui/material/Button'

import BarChartFields from './BarChartFields'

const ChartForm = ({ onSubmit, fields, control, ...rest }) => {
  return (
    <form onSubmit={onSubmit}>
      <BarChartFields control={control} fields={fields} {...rest} />
      <div>
        <Button type="submit" variant="contained">
          Submit Form
        </Button>
      </div>
    </form>
  )
}

export default ChartForm
