import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Card, CardContent, Typography } from '@mui/material'

import { routes } from '../routes/routes'
import api from '../api'
import ResetPasswordForm from '../forms/ResetPasswordForm'
import { NotificationContext } from '../contexts'

const ResetPasswordPage = () => {
  const [, setNotification] = useContext(NotificationContext)
  const navigate = useNavigate()
  const onSubmit = async (resetAttributes) => {
    try {
      await api.auth.resetPassword(resetAttributes)

      navigate(routes.signin)

      setNotification({
        open: true,
        message: 'Password has been updated successfully.',
      })
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

  return (
    <>
      <Typography variant="body1">Reset your DPDash account</Typography>

      <ResetPasswordForm
        initialValues={{
          username: '',
          password: '',
          confirmPassword: '',
          reset_key: '',
        }}
        onCancel={() => navigate(routes.signin)}
        onSubmit={onSubmit}
      />
    </>
  )
}

export default ResetPasswordPage
