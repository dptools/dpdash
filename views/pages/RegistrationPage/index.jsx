import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'

import RegistrationForm from '../../forms/RegisterForm'
import { NotificationContext } from '../../contexts'
import api from '../../api'
import { routes } from '../../routes/routes'
import { fontSize } from '../../../constants'

import './RegistrationPage.css'

const RegistrationPage = () => {
  const [, setNotification] = useContext(NotificationContext)
  const onSubmit = async (data) => {
    try {
      await api.auth.signup(data)

      setNotification({
        open: true,
        message:
          'Account has been created, please wait for an Admin to provide access.',
      })
    } catch (error) {
      setNotification({
        open: true,
        message: error.message,
      })
    }
  }
  return (
    <>
      <Typography variant="h4" sx={{ py: fontSize[16] }}>
        Sign Up
      </Typography>
      <Typography
        variant="body1"
        sx={{
          py: '16px',
          fontSize: { xs: fontSize[14] },
        }}
      >
        Already have a DPDash account?
        <Link to={routes.signin} className="RegistrationPageSignInLink">
          Sign in
        </Link>
      </Typography>
      <RegistrationForm
        initialValues={{
          username: '',
          password: '',
          confirmPassword: '',
          mail: '',
          fullName: '',
        }}
        onSubmit={onSubmit}
      />
    </>
  )
}

export default RegistrationPage
