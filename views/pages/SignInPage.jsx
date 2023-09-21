import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Card, CardMedia, CardContent, Typography } from '@material-ui/core'
import { routes } from '../routes/routes'
import api from '../api'
import {
  AuthContext,
  DimensionsContext,
  NotificationContext,
} from '../contexts'
import { MIN_WIDTH } from '../../constants'
import LoginForm from '../forms/LoginForm'

const SignInPage = ({ classes }) => {
  const [width] = useContext(DimensionsContext)
  const [showPassword, setShowPassword] = useState(false)
  const { handleSubmit, control } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  })
  const [, setUser] = useContext(AuthContext)
  const [, setNotification] = useContext(NotificationContext)
  const navigate = useNavigate()
  const handleFormSubmit = async (data) => {
    try {
      const user = await api.auth.login(data)

      setUser(user)
      navigate(routes.main)
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

  return (
    <div className={classes.login_container}>
      <Card className={classes.login_card}>
        <div className={classes.login_card_column}>
          <CardContent className={classes.login_content}>
            <Typography variant="title" className={classes.login_title}>
              Welcome to DPdash!
            </Typography>
            <Typography variant="subheading" color="textSecondary">
              Please log in to continue.
            </Typography>
          </CardContent>
          <LoginForm
            classes={classes}
            control={control}
            onSubmit={handleSubmit(handleFormSubmit)}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        </div>
        {width < MIN_WIDTH ? null : (
          <CardMedia image="/img/dpdash.png" className={classes.form_image} />
        )}
      </Card>
    </div>
  )
}

export default SignInPage
