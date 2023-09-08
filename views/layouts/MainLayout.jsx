import React, { useState, useEffect, useContext } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import moment from 'moment'
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
  const [subjects, setSubjects] = useState([])
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

  const processDates = (options) => {
    const momentSetting = {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: 'MM/DD/YYYY',
    }
    const nowT = moment().local()
    for (var i = 0; i < options.length; i++) {
      var row = options[i]
      var syncedT = moment.utc(row.synced).local()
      var syncedL = moment(syncedT.format('YYYY-MM-DD')).calendar(
        null,
        momentSetting
      )
      var days = nowT.diff(syncedT, 'days')
      var color = days > 14 ? '#de1d16' : '#14c774'
      options[i]['synced'] = syncedL
      options[i]['lastSyncedColor'] = color
    }
    return options
  }
  useEffect(() => {
    fetchSubjects().then((acl) => {
      const extractSubjectsFromAcl = processDates(
        acl.map(({ subjects }) => subjects).flat()
      )
      setSubjects(extractSubjectsFromAcl)
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
            subjects,
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
