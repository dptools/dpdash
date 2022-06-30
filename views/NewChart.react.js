import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'

import Header from './components/Header'
import Sidebar from './components/Sidebar'

import ChartForm from './forms/ChartForm'

import getCounts from './fe-utils/countUtil'
import getAvatar from './fe-utils/avatarUtil'
import { fetchSubjects, createChart } from './fe-utils/fetchUtil'
import getDefaultStyles from './fe-utils/styleUtil'
import { chartStyles } from './styles/chart_styles'

const NewChart = ({ user, classes }) => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [sideBarState, setSideBarState] = useState({ 
    totalDays: 0,
    totalStudies: 0,
    totalSubjects: 0
  })
  const [avatar, setAvatar] = useState('')

  const toggleDrawer = () => setOpenDrawer(!openDrawer)
  const handleSubmit = async (e, formValues) => {
    e.preventDefault()
    await createChart(formValues)
  }

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
        title='Create a New Chart'
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
          <ChartForm 
            classes={classes}
            handleSubmit={handleSubmit}
          />
        </div>
    </div>
  )
}

const styles = theme => ({
  ...getDefaultStyles(theme),
  ...chartStyles(theme)
})

const mapStateToProps = (state) => ({
  user: state.user
})

export default compose(withStyles(styles, { withTheme:true }), connect(mapStateToProps))(NewChart)
