import React from 'react'
import TextInput from '../TextInput'
import { InputAdornment, Button, Typography } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import { Link } from 'react-router-dom'
import Form from '../Form'
import { routes } from '../../routes/routes'

const LoginForm = ({
  classes,
  control,
  showPassword,
  onSubmit,
  setShowPassword,
}) => {
  return (
    <div className={classes.login_form}>
      <Form onSubmit={onSubmit}>
        <TextInput
          name="username"
          label="Username"
          autoFocus={true}
          required={true}
          fullWidth={true}
          margin="normal"
          control={control}
        />
        <br />
        <TextInput
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          control={control}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          required={true}
          margin="normal"
        />
        <br />
        <Typography
          component={Link}
          to={routes.resetpw}
          className={classes.reset_link}
        >
          Forgot your password?
        </Typography>
        <br />
        <Button
          variant="outlined"
          color="primary"
          type="submit"
          className={classes.login_button}
          fullWidth={true}
        >
          Log In
        </Button>
        <br />
        <Typography
          component={Link}
          to={routes.register}
          className={classes.register_link}
        >
          <span>Don't have an account?</span>
          &nbsp;
          <span className={classes.login_sign_up}>Sign up</span>
        </Typography>
      </Form>
    </div>
  )
}

export default LoginForm
