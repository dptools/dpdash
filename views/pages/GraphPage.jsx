import React, { useEffect, useState } from 'react'

import { Box, Divider } from '@mui/material'
import { useOutletContext, useParams } from 'react-router-dom'

import api from '../api'
import { Graph } from '../components/Graph'
import PageHeader from '../components/PageHeader'
import SelectConfigurationForm from '../forms/SelectConfigurationsForm'

const GraphPage = () => {
  const { user, theme, setUser, setNotification } = useOutletContext()
  const [configurations, setConfigurations] = useState([])
  const { study, subject } = useParams()
  const [participants, setParticipants] = useState([])
  const { preferences } = user

  const fetchParticipants = async () => {
    if (subject) {
      setParticipants([subject])
    } else {
      const participantsRes = await api.participants.all({
        sortBy: 'participant',
        sortDirection: 'ASC',
        studies: [study],
      })
      const participants = participantsRes.map((p) => p.participant)
      setParticipants(participants)
    }
  }
  const loadActiveConfigurations = async () => {
    const queryParams = { status: 'active' }
    const configurations = await api.userConfigurations.all(
      user.uid,
      queryParams
    )

    setConfigurations(configurations)
  }
  const handleSubmit = async (formValues) => {
    try {
      const { uid } = user
      const userAttributes = {
        ...user,
        preferences: {
          ...user.preferences,
          config: formValues.config,
        },
      }
      const updatedUser = await api.users.update(uid, userAttributes)

      setUser(updatedUser)
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

  useEffect(() => {
    loadActiveConfigurations()
  }, [])

  useEffect(() => {
    fetchParticipants()
  }, [study, subject])

  return (
    <Box sx={{ p: '20px' }}>
      <PageHeader title="Matrix" />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '15px',
          paddingBottom: '15px',
          maxWidth: '400px',
        }}
      >
        {configurations.length ? (
          <SelectConfigurationForm
            configurations={configurations}
            onSubmit={handleSubmit}
            initialValues={{ config: preferences.config }}
          />
        ) : null}
      </Box>
      {participants.map((participant) => {
        return (
          <Box key={participant}>
            <Graph
              key={`${participant}-graph`}
              study={study}
              subject={participant}
              user={user}
              theme={theme}
              setNotification={setNotification}
            />
            <Divider />
          </Box>
        )
      })}
    </Box>
  )
}

export default GraphPage
