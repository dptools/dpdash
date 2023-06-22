import React, { useContext } from 'react'
import DrawerComponent from './Drawer'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import { ThemeContext } from '../contexts/ThemeContext'
import { AuthContext } from '../contexts/AuthContext'
import getAvatar from '../fe-utils/avatarUtil'

const Sidebar = ({
  handleDrawerToggle,
  mobileOpen,
  totalDays,
  totalStudies,
  totalSubjects,
}) => {
  const { classes, theme } = useContext(ThemeContext)
  const [user] = useContext(AuthContext)
  const avatar = getAvatar({ user })

  return (
    <>
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
            totalStudies={totalStudies}
            totalSubjects={totalSubjects}
            totalDays={totalDays}
            user={user}
            name={user.name}
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
            totalStudies={totalStudies}
            totalSubjects={totalSubjects}
            totalDays={totalDays}
            user={user}
            name={user.name}
          />
        </Drawer>
      </Hidden>
    </>
  )
}

export default Sidebar
