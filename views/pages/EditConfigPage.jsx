import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useOutletContext } from 'react-router-dom'
import { UserConfigModel, UsersModel } from '../models'
import api from '../api'
import useArrayFormFields from '../hooks/useArrayFormFields'
import useGrid from '../hooks/useGrid'
import ConfigForm from '../forms/ConfigForm'
import { colorList } from '../fe-utils/colorList'

const colors = colorList()

const EditConfigPage = () => {
  const { user, setNotification, users } = useOutletContext()
  const [loading, setLoading] = useState(true)
  const { config_id } = useParams()
  const { uid } = user
  const defaultFieldValue = UserConfigModel.defaultConfigValues
  const { handleSubmit, control, getValues } = useForm({
    defaultValues: async () => await fetchCurrentConfig(),
  })
  const { fields, addNewField, removeField } = useArrayFormFields({
    control,
    name: 'config',
    defaultFieldValue,
  })
  const gridState = useGrid()
  const friendsList = UsersModel.createUserFriendList(users, user)

  const handleFormData = async (formValues) => {
    try {
      const updatedConfiguration = await UserConfigModel.processNewConfig(
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
      const formValues = await UserConfigModel.processConfigToFormFields(
        data,
        colors
      )

      setLoading(false)

      return formValues
    } catch (error) {
      setNotification({
        open: true,
        message: error.message,
      })
    }
  }
  const onCopy = (configCategoryIndex) =>
    addNewField(getValues(`config[${configCategoryIndex}]`))

  if (loading) return <div>Loading...</div>

  return (
    <ConfigForm
      colors={colors}
      control={control}
      fields={fields}
      friendsList={friendsList}
      gridState={gridState}
      onAddNewField={addNewField}
      onCopy={onCopy}
      onSubmit={handleSubmit(handleFormData)}
      onRemove={removeField}
    />
  )
}

export default EditConfigPage
