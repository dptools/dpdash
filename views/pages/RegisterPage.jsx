import React, { useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardMedia, Typography } from '@material-ui/core'
import RegistrationForm from '../forms/RegisterForm'
import { NotificationContext, DimensionsContext } from '../contexts'
import { MIN_WIDTH, VALIDATION_EMAIL_REGEX } from '../../constants'
import api from '../api'

const RegisterPage = ({ classes }) => {
  const [width] = useContext(DimensionsContext)
  const [, setNotification] = useContext(NotificationContext)
  const [errors, setErrors] = useState({
    password: { error: false, message: '' },
    email: { error: false, message: '' },
    confirmPassword: { error: false, message: '' },
  })
  const { handleSubmit, control } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      fullName: '',
    },
  })
  const navigate = useNavigate()
  const handleFormSubmit = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        setErrors({
          ...errors,
          password: { error: true, message: 'passwords do not match' },
        })

        return
      } else {
        setErrors({
          ...errors,
          password: { error: false, message: '' },
        })
      }

      const isFormReadyToBeSubmitted = Object.values(errors).every(
        (value) => value.error === false
      )

      if (isFormReadyToBeSubmitted) {
        await api.auth.signup(data)
        setNotification({
          open: true,
          message:
            'Account has been created, please wait for an Admin to provide access.',
        })
      } else {
        setNotification({
          open: true,
          message: 'There are still errors in your form.',
        })
      }
    } catch (error) {
      setNotification({
        open: true,
        message: error.message,
      })
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'email') {
      if (VALIDATION_EMAIL_REGEX.test(value)) {
        setErrors({
          ...errors,
          email: { error: false, message: '' },
        })
      } else if (!VALIDATION_EMAIL_REGEX.test(value)) {
        setErrors({
          ...errors,
          email: { error: true, message: 'incorrect email format' },
        })
      }
    }
    if (name === 'password' || name === 'confirmPassword') {
      if (value.length < 8) {
        setErrors({
          ...errors,
          [name]: {
            error: true,
            message: 'passwords must be a minimum of 8 characters',
          },
        })
      } else {
        setErrors({
          ...errors,
          [name]: { error: false, message: '' },
        })
      }
    }
  }
  return (
    <div>
      <Card>
        <div className={classes.register_card}>
          <CardContent>
            <Typography variant="title" className={classes.register_title}>
              Welcome to DPdash!
            </Typography>
            <Typography variant="subheading" color="textSecondary">
              Please create your DPdash account to continue.
            </Typography>
          </CardContent>
          <div className={classes.register_formContainer}>
            <div>
              <RegistrationForm
                classes={classes}
                control={control}
                onSubmit={handleSubmit(handleFormSubmit)}
                errors={errors}
                navigate={navigate}
                onInputChange={handleChange}
              />
            </div>

            {width < MIN_WIDTH ? null : (
              <CardMedia
                image="/img/dpdash.png"
                className={classes.register_logo}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default RegisterPage
