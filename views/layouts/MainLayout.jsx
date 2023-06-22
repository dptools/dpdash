import React, { useState, useEffect, useContext } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import classNames from 'classnames'

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

import getCounts from '../fe-utils/countUtil'
import { fetchSubjects } from '../fe-utils/fetchUtil'
import { AuthContext } from '../contexts/AuthContext'
import { headerTitle } from './helpers'

const MainLayout = ({ classes, theme }) => {
  const [user] = useContext(AuthContext)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const [openDrawer, setOpenDrawer] = useState(false)
  const [sideBarState, setSideBarState] = useState({
    totalDays: 0,
    totalStudies: 0,
    totalSubjects: 0,
  })

  const toggleDrawer = () => setOpenDrawer(!openDrawer)

  useEffect(() => {
    fetchSubjects().then((acl) => {
      setSideBarState(getCounts({ acl }))
    })
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
        <Outlet context={{ user, classes, theme, navigate }} />
      </div>
    </div>
  )
}

export default MainLayout
