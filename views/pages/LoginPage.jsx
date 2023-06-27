import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import { Link } from 'react-router-dom'
import { routes } from '../routes/routes'
import api from '../api'

const LoginPage = (props) => {
  const [state, setState] = useState({
    message: '',
    username: '',
    password: '',
    showPassword: false,
    open: false,
    windowWidth: window.innerWidth,
  })

  const navigate = useNavigate()

  const handleClick = () => {
    setState((prevState) => {
      return {
        ...prevState,
        open: true,
      }
    })
  }

  const handleCrumbs = () => {
    setState((prevState) => {
      return {
        ...prevState,
        open: false,
        message: '',
      }
    })
  }

  const handleResize = () => {
    setState({
      windowWidth: window.innerWidth,
    })
  }

  const handleChange = (prop) => (event) => {
    setState((prevState) => {
      return { ...prevState, [prop]: event.target.value }
    })
  }
  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }
  const handleClickShowPassword = () => {
    setState((prevState) => {
      return { ...prevState, showPassword: !state.showPassword }
    })
  }

  const handleLogin = async () => {
    try {
      const credentials = {
        username: state.username,
        password: state.password,
      }

      const user = await api.auth.login(credentials)

      props.setUser(user)
      navigate(routes.main)
    } catch (error) {
      setState((prevState) => {
        return {
          ...prevState,
          open: true,
          message: error.message,
        }
      })
    }
  }

  useEffect(() => {
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        height: '100vh',
        width: '100vw',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Card
        style={{
          display: 'flex',
          maxWidth: 600,
          maxHeight: 500,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <CardContent
            style={{
              flex: '1 0 auto',
            }}
          >
            <Typography
              variant="title"
              style={{
                marginTop: '8px',
                marginBottom: '8px',
              }}
            >
              Welcome to DPdash!
            </Typography>
            <Typography variant="subheading" color="textSecondary">
              Please log in to continue.
            </Typography>
          </CardContent>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingTop: '4px',
              paddingLeft: '12px',
              paddingBottom: '4px',
              paddingRight: '12px',
            }}
          >
            <div
              style={{
                paddingTop: '4px',
                paddingLeft: '12px',
                paddingBottom: '12px',
                paddingRight: '12px',
              }}
            >
              <TextField
                id="username"
                name="username"
                type="text"
                label="Username"
                value={state.username}
                onChange={handleChange('username')}
                autoFocus={true}
                required={true}
                fullWidth={true}
                margin="normal"
              />
              <br />
              <TextField
                id="password"
                name="password"
                type={state.showPassword ? 'text' : 'password'}
                value={state.password}
                onChange={handleChange('password')}
                label="Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {state.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
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
                style={{
                  textAlign: 'right',
                  width: '100%',
                  marginTop: '12px',
                  marginBottom: '12px',
                  color: '#5790bd',
                  textDecoration: 'none',
                }}
              >
                Forgot your password?
              </Typography>
              <br />
              <Button
                variant="outlined"
                color="primary"
                type="submit"
                style={{
                  float: 'right',
                  marginTop: '12px',
                  color: '#5790bd',
                }}
                fullWidth={true}
                onClick={() => handleLogin()}
              >
                Log In
              </Button>
              <br />
              <Typography
                component={Link}
                to={routes.register}
                style={{
                  textAlign: 'center',
                  width: '100%',
                  marginTop: '60px',
                  marginBottom: '12px',
                  textDecoration: 'none',
                  fontWeight: 'normal',
                }}
              >
                <span>Don't have an account?</span>
                &nbsp;
                <span
                  style={{
                    fontWeight: '500',
                    color: '#5790bd',
                  }}
                >
                  Sign up
                </span>
              </Typography>
            </div>
          </div>
        </div>
        {state.windowWidth < 620 ? null : (
          <CardMedia
            style={{
              width: '317px',
              margin: '50px',
              backgroundImage: `url("${routes.basePath}/img/dpdash.png")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
            }}
            title="DPdash"
          />
        )}
      </Card>
      <Snackbar
        open={state.open}
        message={state.message}
        autoHideDuration={2000}
        onRequestClose={handleCrumbs}
      />
    </div>
  )
}

export default LoginPage
