import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import ControlledMultiSelect from '../ControlledMultiSelect'

const schema = yup.object().shape({
  readers: yup.array().when(({ isFixed }) => {
    if (isFixed === true) yup.required('Owner cannot be removed')
  }),
})

const ShareConfigurationForm = ({
  onClose,
  onSubmit,
  open,
  options,
  title,
  initialValues,
}) => {
  const { control, reset, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  })
  useEffect(() => {
    reset(initialValues)
  }, [initialValues])

  return (
    <Dialog open={open} onClose={onClose} fullScreen={true}>
      <DialogTitle id="alert-dialog-title">
        <Typography variant="title">{title}</Typography>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ControlledMultiSelect
            name="readers"
            options={options}
            control={control}
          />
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>,
            <Button variant="outlined" type="submit">
              Submit
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ShareConfigurationForm
