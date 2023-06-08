import React from 'react'
import { connect } from 'react-redux'
import 'whatwg-fetch'
import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { configStyles } from './styles/config_styles'

import AppLayout from './layouts/AppLayout'
import ConfigurationsList from './components/ConfigurationsList'

const ConfigPage = (props) => {
  return (
    <AppLayout className={props.classes.content}>
      <ConfigurationsList
        user={props.user}
        classes={props.classes}
        theme={props.theme}
      />
    </AppLayout>
  )
}

const mapStateToProps = (state) => ({
  user: state.user,
})

export default compose(
  withStyles(configStyles, { withTheme: true }),
  connect(mapStateToProps)
)(ConfigPage)
