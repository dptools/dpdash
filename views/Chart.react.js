import React from 'react'

import Button from '@material-ui/core/Button'

import AppLayout from './layouts/AppLayout'

import { routes } from './routes/routes'

const Charts = () => {
  return (
    <AppLayout title='Charts'>
      <Button
        variant="outlined"
        color="primary"
        href={routes.newChart}
      >
        New Chart
      </Button>
    </AppLayout>
  )
}

export default Charts
