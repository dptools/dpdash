import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

import getAvatar from '../fe-utils/avatarUtil'
import getCounts from '../fe-utils/countUtil'
import { fetchSubjects } from '../fe-utils/fetchUtil'
import getDefaultStyles from '../fe-utils/styleUtil'

const AppLayout = ({
  user,
  classes,
  title,
  children
}) => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [sideBarState, setSideBarState] = useState({ 
    totalDays: 0,
    totalStudies: 0,
    totalSubjects: 0 
  })
  const [avatar, setAvatar] = useState('')

  const toggleDrawer = () => setOpenDrawer(!openDrawer)

  useEffect(() => {
    fetchSubjects().then(acl => {
      setSideBarState(getCounts({ acl }))
    })
    setAvatar(getAvatar({ user }))
  }, [])

  return (
    <div className={classes.root}>
      <Header
        handleDrawerToggle={toggleDrawer}
        title={title}
        isAccountPage={false}
      />
      <Sidebar
        avatar={avatar}
        handleDrawerToggle={toggleDrawer}
        mobileOpen={openDrawer}
        totalDays={sideBarState.totalDays}
        totalStudies={sideBarState.totalStudies}
        totalSubjects={sideBarState.totalSubjects}
        user={user}
      />
      <div className={`${classes.content} ${classes.contentPadded}`}>
        {children}
      </div>
    </div>
  )
}

const styles = theme => ({
  ...getDefaultStyles(theme),
})
const mapStateToProps = (state) => ({
  user: state.user
})

export default compose(withStyles(styles, { withTheme: true }), connect(mapStateToProps))(AppLayout)
