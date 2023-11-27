import React, { useState, useEffect } from 'react'
import {
  CssBaseline,
  StyledEngineProvider,
  createTheme,
  ThemeProvider,
  Snackbar
} from '@mui/material'
import {
  AuthContext,
  ConfigurationsContext,
  NotificationContext,
} from './contexts'
import Router from './routes'
import { NOTIFICATION_DEFAULT, THEME } from '../constants'

import 'react-virtualized/styles.css'
import './App.css'

const theme = createTheme(THEME)

const App = () => {
  const [configurations, setConfigurations] = useState([])
  const [notification, setNotification] = useState(NOTIFICATION_DEFAULT)
  const [user, setUser] = useState(null)

  const handleNotificationClose = () => setNotification(NOTIFICATION_DEFAULT)

  return (
    <NotificationContext.Provider value={[notification, setNotification]}>
      <ConfigurationsContext.Provider
        value={[configurations, setConfigurations]}
      >
        <AuthContext.Provider value={[user, setUser]}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <StyledEngineProvider injectFirst>
              <Router user={user} setUser={setUser} />
              <Snackbar
                open={notification.open}
                message={notification.message}
                autoHideDuration={2000}
                onClose={handleNotificationClose}
              />
            </StyledEngineProvider>
          </ThemeProvider>
        </AuthContext.Provider>
      </ConfigurationsContext.Provider>
    </NotificationContext.Provider>
  )
}

export default App
