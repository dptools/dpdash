import React from 'react'
import { ListItem, ListItemIcon, ListItemText } from '@mui/material'
import SidebarLink from './SidebarLink'

const NavItem = ({ to, Icon, label }) => {
  return (
    <ListItem component={SidebarLink} to={to}>
      <ListItemIcon
        sx={{ minWidth: 20, width: 20, height: 20, alignSelf: 'center' }}
      >
        <Icon sx={{ height: 20, width: 20 }} />
      </ListItemIcon>
      <ListItemText
        primary={label}
        sx={{ color: 'text.primary' }}
        primaryTypographyProps={{ sx: { fontWeight: 500 } }}
      />
    </ListItem>
  )
}

export default NavItem
