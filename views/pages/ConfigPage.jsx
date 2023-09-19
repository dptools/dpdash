import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useOutletContext, Link } from 'react-router-dom'

import AttachFile from '@material-ui/icons/AttachFile'
import ContentAdd from '@material-ui/icons/Add'
import { Fab } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip'

import api from '../api'
import ConfigurationsList from '../components/ConfigurationsList'
import { routes } from '../routes/routes'
import ShareForm from '../forms/ShareForm'
import { UsersModel } from '../models'
import useGrid from '../hooks/useGrid'

const ConfigPage = () => {
  const {
    classes,
    configurations,
    navigate,
    setNotification,
    setConfigurations,
    setUser,
    user,
    users,
  } = useOutletContext()
  const { uid, preferences } = user
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState([])
  const [configId, setConfigId] = useState('')
  const gridState = useGrid()

  const { handleSubmit, control, setValue, reset } = useForm()
  const closeForm = () => {
    setConfigId('')
    setOpen(false)
    setOptions([])
    reset()
  }
  const handleChangeFile = async (e) => {
    try {
      e.preventDefault()
      const file = e.target.files ? e.target.files[0] : ''
      const json = await new Response(file).json()
      const userAttributes = {
        owner: uid,
        readers: [uid],
        ...json,
      }
      await api.userConfigurations.create(uid, userAttributes)

      loadAllConfigurations(uid)
    } catch (error) {
      handleNotification(error.message)
    }
  }
  const handleFormData = async (data) => {
    try {
      const configAttributes = {
        readers: UsersModel.createReadersList(data.readers),
      }

      await api.userConfigurations.update(uid, configId, configAttributes)

      loadAllConfigurations(uid)
      closeForm()
    } catch (error) {
      handleNotification(error.message)
    }
  }
  const handleFormModal = (config) => {
    const { owner, readers, _id } = config
    const options = UsersModel.createUserFriendList(users, owner)
    const formValues = UsersModel.createOptionsFromReaders(readers, owner)

    setConfigId(_id)
    setOptions(options)
    setValue('readers', formValues)
    setOpen(true)
  }
  const handleNotification = (message) =>
    setNotification({ open: true, message })

  const copyConfiguration = async (configuration) => {
    try {
      const { _id, ...configAttributes } = configuration
      const newConfig = {
        ...configAttributes,
        owner: uid,
        readers: [uid],
        created: new Date().toUTCString(),
      }

      await api.userConfigurations.create(uid, newConfig)

      loadAllConfigurations(uid)
    } catch (error) {
      handleNotification(error.message)
    }
  }
  const loadAllConfigurations = async (userId) => {
    try {
      const configurations = await api.userConfigurations.all(userId)

      setConfigurations(configurations)
    } catch (error) {
      handleNotification(error.message)
    }
  }
  const removeConfiguration = async (configId) => {
    try {
      await api.userConfigurations.destroy(uid, configId)

      loadAllConfigurations(uid)

      if (preferences.config === configId) updateUserPreferences(configId)
    } catch (error) {
      handleNotification(error.message)
    }
  }
  const updateConfiguration = async (configId, configAttributes) => {
    try {
      await api.userConfigurations.update(uid, configId, configAttributes)
      updateUserPreferences(configId)
      loadAllConfigurations(uid)
    } catch (error) {
      handleNotification(error.message)
    }
  }
  const updateUserPreferences = async (configId) => {
    try {
      const userAttributes = {
        preferences: {
          ...preferences,
          config: preferences.config === configId ? '' : configId,
        },
      }

      const user = await api.users.update(uid, userAttributes)
      setUser(user)
    } catch (error) {
      handleNotification(error.message)
    }
  }
  const onEditConfig = (configId) =>
    navigate(routes.editConfiguration(configId))
  const onViewConfig = (configId) =>
    navigate(routes.viewConfiguration(configId))
  const onRemoveOrUpdateConfig = (ownsConfig, configId) => {
    if (ownsConfig) {
      removeConfiguration(configId)
    } else {
      const configAttributes = {
        readers: readers.filter((reader) => reader !== uid),
      }
      updateConfiguration(configId, configAttributes)
    }
  }

  return (
    <>
      <ConfigurationsList
        classes={classes}
        configurations={configurations}
        gridState={gridState}
        onCopyConfig={copyConfiguration}
        onEditConfig={onEditConfig}
        onOpen={handleFormModal}
        onRemoveOrUpdateConfig={onRemoveOrUpdateConfig}
        onUpdatePreferences={updateUserPreferences}
        onViewConfig={onViewConfig}
        user={user}
      />
      <ShareForm
        classes={classes}
        control={control}
        onClose={closeForm}
        onSubmit={handleSubmit(handleFormData)}
        open={open}
        options={options}
        title="Share your configuration"
      />
      <div className={classes.uploadActions}>
        <form>
          <input
            accept=".json"
            name="file"
            id="raised-button-file"
            multiple
            type="file"
            className={classes.hiddenInput}
            onChange={handleChangeFile}
          />
          <label htmlFor="raised-button-file">
            <Fab focusRipple className={classes.fabButtonStyles}>
              <Tooltip title="Upload configuration file">
                <AttachFile />
              </Tooltip>
            </Fab>
          </label>
        </form>
        <Fab
          component={Link}
          color="secondary"
          to={routes.newConfiguration}
          focusRipple
        >
          <Tooltip title="Add a configuration manually">
            <ContentAdd />
          </Tooltip>
        </Fab>
      </div>
    </>
  )
}

export default ConfigPage
