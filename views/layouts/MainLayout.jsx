import React, { useState, useEffect, useContext } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import classNames from 'classnames'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

import api from '../api'
import {
  AuthContext,
  ConfigurationsContext,
  NotificationContext,
  SidebarContext,
} from '../contexts'
import { headerTitle } from './helpers'

const TEMPORARY_SIDEBAR = 'temporary'
const PERSISTENT_SIDEBAR = 'persistent'
const dashboard = 'dashboard'

const MainLayout = ({ classes, theme }) => {
  const [configurations, setConfigurations] = useContext(ConfigurationsContext)
  const [, setNotification] = useContext(NotificationContext)
  const [openSidebar, setOpenSidebar] = useContext(SidebarContext)
  const [user, setUser] = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [drawerVariant, setDrawerVariant] = useState(PERSISTENT_SIDEBAR)
  const { pathname } = useLocation()
  const params = useParams()
  const navigate = useNavigate()
  const [sideBarState, setSideBarState] = useState({
    totalDays: 0,
    totalStudies: 0,
    totalSubjects: 0,
  })
  const toggleSidebar = () => setOpenSidebar(!openSidebar)
  const fetchUsers = async () => {
    try {
      const usersList = await api.users.loadAll()
      setUsers(usersList)
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const loadAllConfigurations = async () => {
    try {
      const configurations = await api.userConfigurations.all(user.uid)

      setConfigurations(configurations)
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const handleDashboardContent = () => {
    if (pathname.includes(dashboard)) {
      setDrawerVariant(TEMPORARY_SIDEBAR)
    } else {
      setDrawerVariant(PERSISTENT_SIDEBAR)
      setOpenSidebar(true)
    }
  }
  const fetchCounts = async () => {
    const { numOfSites, maxDay, numOfParticipants } = await api.counts.all()

    setSideBarState({
      totalDays: maxDay,
      totalStudies: numOfSites,
      totalSubjects: numOfParticipants,
    })
  }

  useEffect(() => {
    fetchCounts()
    fetchUsers()
    loadAllConfigurations()
  }, [])
  useEffect(() => {
    handleDashboardContent()
  }, [pathname])

  return (
    <div className={classes.root}>
      <Header
        onToggleSidebar={toggleSidebar}
        title={headerTitle(pathname, params)}
        isAccountPage={false}
        user={user}
      />
      <Sidebar
        drawerVariant={drawerVariant}
        onToggleSidebar={toggleSidebar}
        sidebarOpen={openSidebar}
        totalDays={sideBarState.totalDays}
        totalStudies={sideBarState.totalStudies}
        totalSubjects={sideBarState.totalSubjects}
      />
      <div className={classNames(classes.content, classes.contentPadded)}>
        <Outlet
          context={{
            classes,
            configurations,
            navigate,
            openSidebar,
            setConfigurations,
            setOpenSidebar,
            setNotification,
            setUser,
            setUsers,
            theme,
            user,
            users,
          }}
        />
      </div>
    </div>
  )
}
export default MainLayout
