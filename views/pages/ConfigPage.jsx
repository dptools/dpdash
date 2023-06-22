import React from 'react'
import { useOutletContext } from 'react-router-dom'
import ConfigurationsList from '../components/ConfigurationsList'

const ConfigPage = () => {
  const { user, classes, theme, navigate } = useOutletContext()

  return (
    <ConfigurationsList
      user={user}
      classes={classes}
      theme={theme}
      navigate={navigate}
    />
  )
}

export default ConfigPage
