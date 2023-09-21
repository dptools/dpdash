import React, { useState, useEffect } from 'react'
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Snackbar from '@material-ui/core/Snackbar'
import {
  AuthContext,
  ConfigurationsContext,
  NotificationContext,
  ThemeContext,
  SidebarContext,
  DimensionsContext,
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
  const [width, setWidth] = useState(0)

  const handleNotificationClose = () => setNotification(NOTIFICATION_DEFAULT)
  const handleResize = () => setWidth(window.innerWidth)

  useEffect(() => {
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <MuiThemeProvider>
      <CssBaseline />
      <ThemeContext.Provider
        value={{ classes: props.classes, theme: props.theme }}
      >
        <DimensionsContext.Provider value={[width, setWidth]}>
          <SidebarContext.Provider value={[openSidebar, setOpenSidebar]}>
            <NotificationContext.Provider
              value={[notification, setNotification]}
            >
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
        </DimensionsContext.Provider>
      </ThemeContext.Provider>
    </MuiThemeProvider>
  )
}

export default withStyles(styles, { withTheme: true })(App)
