import React, { useState } from 'react'

import {
  CssBaseline,
  StyledEngineProvider,
  createTheme,
  ThemeProvider,
  Snackbar,
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { AuthContext, NotificationContext } from './contexts'
import Router from './routes'
import { NOTIFICATION_DEFAULT, THEME } from '../constants'

import './App.css'

const theme = createTheme(THEME)

const App = () => {
  const [notification, setNotification] = useState(NOTIFICATION_DEFAULT)
  const [user, setUser] = useState(null)

  const handleNotificationClose = () => setNotification(NOTIFICATION_DEFAULT)

  return (
    <NotificationContext.Provider value={[notification, setNotification]}>
      <AuthContext.Provider value={[user, setUser]}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <StyledEngineProvider injectFirst>
              <Router user={user} setUser={setUser} />
              <Snackbar
                open={notification.open}
                message={notification.message}
                autoHideDuration={2000}
                onClose={handleNotificationClose}
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
              />
            </StyledEngineProvider>
          </ThemeProvider>
        </LocalizationProvider>
      </AuthContext.Provider>
    </NotificationContext.Provider>
  )
}

export default App
