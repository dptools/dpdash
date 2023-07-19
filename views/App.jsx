import React, { useState } from 'react'
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Snackbar from '@material-ui/core/Snackbar'
import { AuthContext, NotificationContext, ThemeContext } from './contexts'
import Router from './routes'
import { styles } from './styles'
import { NOTIFICATION_DEFAULT } from '../constants'

import 'react-virtualized/styles.css'

const App = (props) => {
  const [notification, setNotification] = useState(NOTIFICATION_DEFAULT)
  const [user, setUser] = useState(null)
  const handleNotificationClose = () => setNotification(NOTIFICATION_DEFAULT)

  return (
    <MuiThemeProvider>
      <CssBaseline />
      <ThemeContext.Provider
        value={{ classes: props.classes, theme: props.theme }}
      >
        <NotificationContext.Provider value={[notification, setNotification]}>
          <AuthContext.Provider value={[user, setUser]}>
            <Router {...props} user={user} setUser={setUser} />
            <Snackbar
              open={notification.open}
              message={notification.message}
              autoHideDuration={2000}
              onClose={handleNotificationClose}
            />
          </AuthContext.Provider>
        </NotificationContext.Provider>
      </ThemeContext.Provider>
    </MuiThemeProvider>
  )
}

export default withStyles(styles, { withTheme: true })(App)
