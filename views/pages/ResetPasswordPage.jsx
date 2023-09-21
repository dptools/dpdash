import React, { useState, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import { MIN_WIDTH } from '../../constants'

import { routes } from '../routes/routes'
import api from '../api'
import ResetPasswordForm from '../forms/ResetPasswordForm'
import { NotificationContext, DimensionsContext } from '../contexts'

const ResetPasswordPage = ({ classes }) => {
  const [width] = useContext(DimensionsContext)
  const [, setNotification] = useContext(NotificationContext)
  const [errors, setErrors] = useState({
    password: { error: false, message: '' },
    reset_key: { error: false, message: '' },
  })
  const { handleSubmit, control } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      reset_key: '',
    },
  })
  const navigate = useNavigate()

  const handleFormSubmit = async (resetAttributes) => {
    try {
      switch (true) {
        case resetAttributes.password !== resetAttributes.confirmPassword:
          setErrors({
            ...errors,
            password: { error: true, message: 'passwords do not match' },
          })

          break
        case resetAttributes.password.length < 8 ||
          resetAttributes.confirmPassword.length < 8:
          setErrors({
            ...errors,
            password: {
              error: true,
              message: 'passwords must be a minimum of 8 characters',
            },
          })

          break

        case resetAttributes.reset_key.length < 1:
          setErrors({
            ...errors,
            reset_key: {
              error: true,
            },
          })
        default:
          setErrors({
            password: { error: false, message: '' },
            reset_key: { error: false, message: '' },
          })

          await api.auth.resetPassword(resetAttributes)

          navigate(routes.login)

          setNotification({
            open: true,
            message: 'Password has been updated successfully',
          })
      }
    } catch (error) {
      setNotification({ open: true, message: error.message })
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
              Reset your DPdash account.
            </Typography>
          </CardContent>
          <div className={classes.register_formContainer}>
            <div>
              <ResetPasswordForm
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

export default ResetPasswordPage
