import React, { useState, useEffect, useContext } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

import api from '../api'
import getCounts from '../fe-utils/countUtil'
import { fetchSubjects } from '../fe-utils/fetchUtil'
import { AuthContext, NotificationContext } from '../contexts'
import { headerTitle } from './helpers'

const MainLayout = ({ classes, theme }) => {
  const [, setNotification] = useContext(NotificationContext)
  const [user, setUser] = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const [openDrawer, setOpenDrawer] = useState(false)
  const [sideBarState, setSideBarState] = useState({
    totalDays: 0,
    totalStudies: 0,
    totalSubjects: 0,
  })

  const toggleDrawer = () => setOpenDrawer(!openDrawer)
  const fetchUsers = async () => {
    try {
      const usersList = await api.users.loadAll()
      setUsers(usersList)
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

  useEffect(() => {
    fetchSubjects().then((acl) => {
      setSideBarState(getCounts({ acl }))
    })
    fetchUsers()
  }, [])

  return (
    <div className={classes.root}>
      <Header
        handleDrawerToggle={toggleDrawer}
        title={headerTitle(pathname)}
        isAccountPage={false}
      />
      <Sidebar
        handleDrawerToggle={toggleDrawer}
        mobileOpen={openDrawer}
        totalDays={sideBarState.totalDays}
        totalStudies={sideBarState.totalStudies}
        totalSubjects={sideBarState.totalSubjects}
      />
      <div className={classNames(classes.content, classes.contentPadded)}>
        <Outlet
          context={{
            classes,
            navigate,
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
