import React from 'react'

import {
  SpaceDashboard,
  Group,
  ShowChart,
  DashboardCustomize,
  AdminPanelSettings,
  FolderOpen,
} from '@mui/icons-material'
import { List, Divider } from '@mui/material'

import NavItem from './NavItem'
import { routes } from '../../routes/routes'

const SideNavigation = ({ user }) => {
  return (
    <nav data-testid="nav">
      <List>
        <NavItem Icon={SpaceDashboard} to={routes.main} label="Dashboard" />
        <NavItem Icon={Group} to={routes.participants} label="Participants" />
        <NavItem Icon={ShowChart} to={routes.charts} label="Charts" />
        <NavItem Icon={FolderOpen} to={routes.studies} label="Studies" />
        <NavItem
          Icon={DashboardCustomize}
          to={routes.configurations}
          label="Configurations"
        />
        {user.role === 'admin' && (
          <NavItem Icon={AdminPanelSettings} to={routes.admin} label="Admin" />
        )}
        <Divider light />
      </List>
    </nav>
  )
}

export default SideNavigation
