import React, { useState, useEffect } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { UserConfigModel, UsersModel } from '../models'
import { Box, Typography } from '@mui/material'

import api from '../api'
import ConfigForm from '../forms/ConfigForm'
import { colorList } from '../fe-utils/colorList'

const colors = colorList()

const EditConfigPage = () => {
  const { user, setNotification, users } = useOutletContext()
  const [initialValues, setInitialValues] = useState({})
  const [loading, setLoading] = useState(true)
  const { config_id } = useParams()
  const friendsList = UsersModel.createUserFriendList(users, user)
  const { uid } = user

  const handleSubmit = async (formValues) => {
    try {
      const updatedConfiguration = UserConfigModel.processNewConfig(
        formValues,
        colors,
        uid
      )
      await api.userConfigurations.update(uid, config_id, updatedConfiguration)

      setNotification({
        open: true,
        message: 'Configuration Added',
      })
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const fetchCurrentConfig = async () => {
    try {
      const data = await api.userConfigurations.findOne(uid, config_id)

      return UserConfigModel.processConfigToFormFields(data, colors)
    } catch (error) {
      setNotification({
        open: true,
        message: error.message,
      })
    }
  }

  useEffect(() => {
    fetchCurrentConfig().then((values) => {
      setInitialValues(values)
      setLoading(false)
    })
  }, [])

  if (loading) return <div>Depending on the size, this may take a while...</div>

  return (
    <Box sx={{ p: '30px' }}>
      <Typography variant="h6">Edit Configuration</Typography>
      <ConfigForm
        colors={colors}
        friendsList={friendsList}
        onSubmit={handleSubmit}
        initialValues={initialValues}
      />
    </Box>
  )
}

export default EditConfigPage
