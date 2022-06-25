import React from 'react'
import Button from '@material-ui/core/Button';
import { routes } from './routes/routes'

export default function Charts() {
  return (
    <>
      <h1> Charts</h1>
      <Button
        variant="outlined"
        color="primary"
        href={routes.newChart}
      >
        New Chart
      </Button>
    </>
  )
}
