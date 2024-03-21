import React, { useState } from 'react'
import { Box, Button, useMediaQuery } from '@mui/material'
import { Add, UploadFile } from '@mui/icons-material'
import { useOutletContext, Link } from 'react-router-dom'

import ConfigurationsTable from '../../tables/ConfigurationsTable'
import PageHeader from '../../components/PageHeader'
import { UsersModel } from '../../models'
import api from '../../api'
import ShareConfigurationForm from '../../forms/ShareConfigurationForm'
import { routes } from '../../routes/routes'
import { fontSize } from '../../../constants'

import './ConfigurationsPage.css'

const ConfigurationsPage = () => {
  const isMobile = useMediaQuery('(max-width:900px)')
  const {
    configurations,
    navigate,
    setNotification,
    setConfigurations,
    setUser,
    user,
    users,
  } = useOutletContext()
  const { uid, preferences } = user
  const [configuration, setConfiguration] = useState(null)
  const open = !!configuration?._id
  const options =
    configuration?.readers && configuration?.owner
      ? UsersModel.createUserFriendList(users, configuration.owner)
      : []
  const initialValues =
    configuration?.readers && configuration?.owner
      ? {
          readers: UsersModel.createOptionsFromReaders(
            configuration.readers,
            configuration.owner
          ),
        }
      : { readers: [] }

  const handleNotification = (message) =>
    setNotification({ open: true, message })
  const onSubmit = async (data) => {
    try {
      const configAttributes = {
        readers: UsersModel.createReadersList(data.readers),
      }
      await api.userConfigurations.update(
        uid,
        configuration._id,
        configAttributes
      )

      await loadAllConfigurations(uid)

      closeForm()
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
  const closeForm = () => setConfiguration(null)

  const handleFormModal = async (config) => setConfiguration(config)

  const handleDefaultConfiguration = async (configurationId) => {
    try {
      const userAttributes = {
        ...user,
        preferences: {
          ...preferences,
          config: preferences.config === configurationId ? '' : configurationId,
        },
      }
      const updatedUser = await api.users.update(uid, userAttributes)

      setUser(updatedUser)
    } catch (error) {
      handleNotification(error.message)
    }
  }
  const handleEditConfig = (configurationId) =>
    navigate(routes.editConfiguration(configurationId))
  const handleDeleteConfig = async (configurationId) => {
    try {
      await api.userConfigurations.destroy(uid, configurationId)

      await loadAllConfigurations(uid)

      if (preferences.config === configurationId)
        handleDefaultConfiguration(configurationId)
    } catch (error) {
      handleNotification(error.message)
    }
  }
  const handleDuplicateConfiguration = async (configuration) => {
    try {
      const { _id, ...configAttributes } = configuration
      const newConfig = {
        ...configAttributes,
        owner: uid,
        readers: [uid],
      }

      await api.userConfigurations.create(uid, newConfig)
      await loadAllConfigurations(uid)
    } catch (error) {
      handleNotification(error.message)
    }
  }

  const handleConfigurationUpload = (e) => {
    try {
      const file = e.target.files ? e.target.files[0] : ''

      new Response(file).json().then(async ({ name, config }) => {
        const newConfigurationAttributes = {
          config: {
            0: config,
          },
          name,
          owner: user.uid,
          readers: [user.uid],
          type: 'matrix',
        }

        await api.userConfigurations.create(
          user.uid,
          newConfigurationAttributes
        )
        await loadAllConfigurations(uid)

        handleNotification('New configuration added')
      })
    } catch (error) {
      handleNotification(error.message)
    }
  }

  return (
    <Box sx={{ p: '20px' }}>
      <PageHeader
        title="Configurations"
        cta={
          <div className="ConfigurationsPageActions">
            <Button
              component={Link}
              endIcon={isMobile ? '' : <Add />}
              to={routes.newConfiguration}
              size="small"
              sx={{
                backgroundColor: 'primary.dark',
                textTransform: 'none',
                fontSize: { xs: fontSize[9], sm: fontSize[16] },
                gridColumnStart: 1,
              }}
              variant="contained"
            >
              New Configuration
            </Button>
            <Button
              endIcon={isMobile ? '' : <UploadFile />}
              size="small"
              sx={{
                textTransform: 'none',
                fontSize: { xs: fontSize[9], sm: fontSize[16] },
                gridColumnStart: 2,
              }}
              variant="contained"
              component="label"
              htmlFor="configFile"
            >
              Upload Configuration
              <input
                type="file"
                accept="application/json"
                data-testid="configFile-input"
                id="configFile"
                hidden
                onChange={handleConfigurationUpload}
              />
            </Button>
          </div>
        }
      />
      <ConfigurationsTable
        configurations={configurations}
        onShare={handleFormModal}
        onDefaultChange={handleDefaultConfiguration}
        onEdit={handleEditConfig}
        onDelete={handleDeleteConfig}
        onDuplicate={handleDuplicateConfiguration}
        user={user}
      />
      {configuration?._id && (
        <ShareConfigurationForm
          initialValues={initialValues}
          onClose={closeForm}
          onSubmit={onSubmit}
          open={open}
          options={options}
          title="Share your configuration"
        />
      )}
    </Box>
  )
}

export default ConfigurationsPage
