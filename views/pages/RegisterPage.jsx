import React, { useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardMedia, Typography } from '@material-ui/core'
import RegistrationForm from '../forms/RegisterForm'
import { NotificationContext } from '../contexts'
import { MIN_WIDTH, VALIDATION_EMAIL_REGEX } from '../../constants'
import api from '../api'

const RegisterPage = ({ classes }) => {
  const [width, setWidth] = useState(window.innerWidth)
  const [errors, setErrors] = useState({
    password: { error: false, message: '' },
    email: { error: false, message: '' },
    username: { error: false, message: '' },
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
  const [, setNotification] = useContext(NotificationContext)
  const navigate = useNavigate()
  const handleFormSubmit = async (data) => {
    switch (true) {
      case data.password !== data.confirmPassword:
        setErrors({
          ...errors,
          password: { error: true, message: 'passwords do not match' },
        })

        break
      case data.password.length < 8 || data.confirmPassword.length < 8:
        setErrors({
          ...errors,
          password: {
            error: true,
            message: 'passwords must be a minimum of 8 characters',
          },
        })

        break
      case !VALIDATION_EMAIL_REGEX.test(data.email):
        setErrors({
          ...errors,
          email: { error: true, message: 'incorrect email format' },
        })

        break
      default:
        setErrors({
          password: { error: false, message: '' },
          email: { error: false, message: '' },
        })

        await api.auth.signup(data)

        setNotification({
          open: true,
          message:
            'Account has been created, please wait for an Admin to provide access.',
        })
    }
  }

  const handleResize = () => setWidth(window.innerWidth)

  useEffect(() => {
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
