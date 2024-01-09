import React from 'react'
import { useForm } from 'react-hook-form'
import { useOutletContext } from 'react-router-dom'

import api from '../api'
import useArrayFormFields from '../hooks/useArrayFormFields'
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
  const defaultFieldValue = UserConfigModel.defaultConfigValues
  const { handleSubmit, control, getValues } = useForm({ defaultValues })
  const { fields, addNewField, removeField } = useArrayFormFields({
    control,
    name: 'config',
    defaultFieldValue,
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
        message: UserConfigModel.message.successAdd,
      })
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const onCopy = (configCategoryIndex) =>
    addNewField(getValues(`config[${configCategoryIndex}]`))

  return (
    <Box sx={{ p: '30px' }}>
      <Typography variant="h6">New Configuration</Typography>
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

export default NewConfigPage
