import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useOutletContext } from 'react-router-dom'
import { UserConfigModel, UsersModel } from '../models'
import { Box, Typography } from '@mui/material'

import api from '../api'
import useArrayFormFields from '../hooks/useArrayFormFields'
import ConfigForm from '../forms/ConfigForm'
import { colorList } from '../fe-utils/colorList'

const colors = colorList()

const EditConfigPage = () => {
  const { user, setNotification, users } = useOutletContext()
  const [loading, setLoading] = useState(true)
  const { config_id } = useParams()
  const { uid } = user
  const defaultFieldValue = UserConfigModel.defaultConfigValues
  const { handleSubmit, control, getValues, reset } = useForm({
    defaultValues: async () => await fetchCurrentConfig(),
  })
  const { fields, addNewField, removeField } = useArrayFormFields({
    control,
    name: 'config',
    defaultFieldValue,
  })
  const friendsList = UsersModel.createUserFriendList(users, user)

  const handleFormData = async (formValues) => {
    try {
      const updatedConfiguration = UserConfigModel.processNewConfig(
        formValues,
        colors,
        uid
      )

      await api.userConfigurations.update(uid, config_id, updatedConfiguration)

      setNotification({
        open: true,
        message: UserConfigModel.message.successUpdate,
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
  const onCopy = (configCategoryIndex) =>
    addNewField(getValues(`config[${configCategoryIndex}]`))

  useEffect(() => {
    fetchCurrentConfig().then((values) => {
      reset(values)
      setLoading(false)
    })
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <Box sx={{ p: '30px' }}>
      <Typography variant="h6">Edit Configuration</Typography>
      <ConfigForm
        colors={colors}
        control={control}
        fields={fields}
        friendsList={friendsList}
        onAddNewField={addNewField}
        onCopy={onCopy}
        onSubmit={handleSubmit(handleFormData)}
        onRemove={removeField}
      />
    </Box>
  )
}

export default EditConfigPage
