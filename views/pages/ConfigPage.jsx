import React from 'react'
import { useOutletContext } from 'react-router-dom'
import ConfigurationsList from '../components/ConfigurationsList'

const ConfigPage = () => {
  const { user, classes, theme, navigate, setNotification } = useOutletContext()
  const handleNotification = (message) =>
    setNotification({ open: true, message })

  return (
    <ConfigurationsList
      user={user}
      classes={classes}
      theme={theme}
      navigate={navigate}
      onNotification={handleNotification}
    />
  )
}

export default ConfigPage
