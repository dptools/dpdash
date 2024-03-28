import React, { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import {
  Box,
  Divider
} from '@mui/material'

import PageHeader from '../components/PageHeader'
import SelectConfigurationForm from '../components/SelectConfigurationForm'
import { Graph } from '../components/Graph'
import api from '../api'

const GraphPage = () => {
  const { configurations, user, theme, setUser, setNotification } =
    useOutletContext()
  const { study, subject } = useParams()
  const [participants, setParticipants] = useState([])
  
  const fetchParticipants = async () => {
    if (subject) {
      setParticipants([subject])
    } else {
      const participantsRes = await api.participants.all({
        sortBy: 'participant',
        sortDirection: 'ASC',
        studies: [study]
      })
      const participants = participantsRes.map((p) => p.participant)
      setParticipants(participants)
    }
  }

  useEffect(() => {
    fetchParticipants()
  }, [study, subject])
  
  const updateUserPreferences = async (configurationId) => {
    try {
      const { uid } = user
      const userAttributes = {
        ...user,
        preferences: {
          ...user.preferences,
          config: configurationId,
        },
      }
      setUser(userAttributes)
      await api.users.update(uid, userAttributes)
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

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
        <SelectConfigurationForm
          configurations={configurations}
          onChange={updateUserPreferences}
          currentPreference={user.preferences}
        />
      </Box>
        {
          participants.map((participant) => {
            return <Box>
              <Graph key={`${participant}-graph`} study={study} subject={participant} user={user} theme={theme} setNotification={setNotification}/>
              <Divider/>
            </Box>
          })
        }
    </Box>
  )
}

export default GraphPage
