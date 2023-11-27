import React from 'react'
import { Drawer } from '@mui/material'
import SidebarLogo from './SidebarLogo'
import SideNavigation from './SideNavigation'
import SidebarFooter from './SidebarFooter'

const Sidebar = ({ user, sidebarOpen, onLogout }) => {
  return (
    <Drawer
      variant="permanent"
      open={sidebarOpen}
      sx={{ height: '100vh' }}
      PaperProps={{
        sx: {
          p: '8px',
          position: 'fixed',
          width: '253px',
          left: 0,
          top: 0,
          bottom: 0,
        },
      }}
    >
      <SidebarLogo />
      <SideNavigation user={user} />
      <SidebarFooter user={user} onLogout={onLogout} />
    </Drawer>
  )
}

export default Sidebar
