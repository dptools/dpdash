import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import DrawerComponent from './Drawer'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import { ThemeContext } from '../contexts/ThemeContext'
import { AuthContext } from '../contexts/AuthContext'
import getAvatar from '../fe-utils/avatarUtil'
import api from '../api'
import { routes } from '../routes/routes'

const Sidebar = ({
  handleDrawerToggle,
  mobileOpen,
  totalDays,
  totalStudies,
  totalSubjects,
}) => {
  const { classes, theme } = useContext(ThemeContext)
  const [user, setUser] = useContext(AuthContext)
  const avatar = getAvatar({ user })
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.auth.logout()

      setUser(null)
      navigate(routes.login)
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className={classes.sideBar}>
      <Hidden mdUp>
        <Drawer
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <DrawerComponent
            avatar={avatar}
            classes={classes}
            name={user.name}
            onLogout={handleLogout}
            totalStudies={totalStudies}
            totalSubjects={totalSubjects}
            totalDays={totalDays}
            user={user}
          />
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          variant="permanent"
          open
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <DrawerComponent
            avatar={avatar}
            classes={classes}
            name={user.name}
            onLogout={handleLogout}
            totalStudies={totalStudies}
            totalSubjects={totalSubjects}
            totalDays={totalDays}
            user={user}
          />
        </Drawer>
      </Hidden>
    </div>
  )
}

export default Sidebar
