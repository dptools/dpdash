import React, { useState } from 'react'
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Snackbar from '@material-ui/core/Snackbar'
import {
  AuthContext,
  ConfigurationsContext,
  NotificationContext,
  ThemeContext,
  SidebarContext,
} from './contexts'
import Router from './routes'
import { styles } from './styles'
import { NOTIFICATION_DEFAULT } from '../constants'

import 'react-virtualized/styles.css'

const App = (props) => {
  const [configurations, setConfigurations] = useState([])
  const [openSidebar, setOpenSidebar] = useState(true)
  const [notification, setNotification] = useState(NOTIFICATION_DEFAULT)
  const [user, setUser] = useState(null)
  const handleNotificationClose = () => setNotification(NOTIFICATION_DEFAULT)

  return (
    <MuiThemeProvider>
      <CssBaseline />
      <ThemeContext.Provider
        value={{ classes: props.classes, theme: props.theme }}
      >
        <SidebarContext.Provider value={[openSidebar, setOpenSidebar]}>
          <NotificationContext.Provider value={[notification, setNotification]}>
            <ConfigurationsContext.Provider
              value={[configurations, setConfigurations]}
            >
              <AuthContext.Provider value={[user, setUser]}>
                <Router {...props} user={user} setUser={setUser} />
                <Snackbar
                  open={notification.open}
                  message={notification.message}
                  autoHideDuration={2000}
                  onClose={handleNotificationClose}
                />
              </AuthContext.Provider>
            </ConfigurationsContext.Provider>
          </NotificationContext.Provider>
        </SidebarContext.Provider>
      </ThemeContext.Provider>
    </MuiThemeProvider>
  )
}

export default withStyles(styles, { withTheme: true })(App)
