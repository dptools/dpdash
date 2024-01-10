import React from 'react'
import { useOutletContext } from 'react-router-dom'

import api from '../api'
import ConfigForm from '../forms/ConfigForm'
import { UserConfigModel, UsersModel } from '../models'
import { colorList } from '../fe-utils/colorList'
import { Typography, Box } from '@mui/material'

const colors = colorList()

const NewConfigPage = () => {
  const { user, users, setNotification } = useOutletContext()
  const { uid } = user
  const defaultValues = UserConfigModel.defaultFormValues({
    readers: [{ value: uid, label: uid, isFixed: true }],
    owner: uid,
  })
  const friendsList = UsersModel.createUserFriendList(users, user)

  const handleFormData = async (formValues) => {
    try {
      const newConfigurationAttributes = UserConfigModel.processNewConfig(
        formValues,
        colors,
        uid
      )

      await api.userConfigurations.create(uid, newConfigurationAttributes)

      setNotification({
        open: true,
        message: 'Configuration Added',
      })
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

  return (
    <Box sx={{ p: '30px' }}>
      <Typography variant="h6">New Configuration</Typography>
      <ConfigForm
        colors={colors}
        friendsList={friendsList}
        onSubmit={handleFormData}
        initialValues={defaultValues}
      />
    </Box>
  )
}

export default NewConfigPage
