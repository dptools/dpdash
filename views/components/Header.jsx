import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ColorLens from '@material-ui/icons/ColorLens'
import Person from '@material-ui/icons/Person'
import openNewWindow from '../fe-utils/windowUtil'
import { ThemeContext } from '../contexts/ThemeContext'
import basePathConfig from '../../server/configs/basePathConfig'
import { routes } from '../routes/routes'

const basePath = basePathConfig || ''

const Header = ({ handleDrawerToggle, isAccountPage, title }) => {
  const { classes } = useContext(ThemeContext)
  const navigate = useNavigate()

  return (
    <AppBar className={classes.appBar}>
      <Toolbar style={{ paddingLeft: '16px' }}>
        <IconButton
          color="default"
          aria-label="Open drawer"
          onClick={handleDrawerToggle}
          className={classes.navIconHide}
        >
          <img width="24px" height="24px" src={`${basePath}/img/favicon.png`} />
        </IconButton>
        <Typography variant="title" color="inherit" className={classes.title}>
          {title}
        </Typography>
        {isAccountPage ? (
          <IconButton onClick={() => navigate(routes.configs)}>
            <ColorLens color="primary" />
          </IconButton>
        ) : (
          <IconButton onClick={() => navigate(routes.accountPage)}>
            <Person color="primary" />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
