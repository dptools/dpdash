import React, { useState } from 'react'
import 'whatwg-fetch'
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import { AuthContext } from './contexts/AuthContext'
import { ThemeContext } from './contexts/ThemeContext'
import Router from './routes'
import { styles } from './styles'

import 'react-virtualized/styles.css'

const App = (props) => {
  const [user, setUser] = useState(null)

  return (
    <MuiThemeProvider>
      <CssBaseline />
      <ThemeContext.Provider
        value={{ classes: props.classes, theme: props.theme }}
      >
        <AuthContext.Provider value={[user, setUser]}>
          <Router {...props} user={user} setUser={setUser} />
        </AuthContext.Provider>
      </ThemeContext.Provider>
    </MuiThemeProvider>
  )
}

export default withStyles(styles, { withTheme: true })(App)
