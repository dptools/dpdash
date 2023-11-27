import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { useOutletContext } from 'react-router-dom'

import ParticipantsTable from '../tables/ParticipantsTable'
import api from '../api'
import { SORT_DIRECTION } from '../../constants'
import ParticipantsSearchForm from '../forms/ParticipantsSearchForm'
import PageHeader from '../components/PageHeader'

const ParticipantsPage = () => {
  const { user, setNotification, setUser } = useOutletContext()
  const { uid, preferences } = user

  const [initialLoad, setInitialLoad] = useState(true)
  const [participants, setParticipants] = useState([])
  const [searchSubjects, setSearchSubjects] = useState([])
  const [searchOptions, setSearchOptions] = useState([])
  const [sortDirection, setDirection] = useState(SORT_DIRECTION.ASC)
  const [sortBy, setSortBy] = useState('')

  const fetchParticipants = React.useCallback(async () => {
    const sortParams = {
      ...(sortBy ? { sortBy } : {}),
      ...(sortDirection ? { sortDirection } : {}),
      ...(searchSubjects
        ? { searchSubjects: normalizeSearchSubjects(searchSubjects) }
        : {}),
    }
    return await api.participants.all(sortParams)
  }, [sortBy, sortDirection, searchSubjects])

  const onStar = async (e) => {
    try {
      const { name, value } = e.target
      const [key, study] = name.split('-')
      const values = preferences[key] || {}

      if (values[study]) {
        if (values[study].includes(value)) {
          values[study] = values[study].filter(
            (participant) => participant !== value
          )
        } else values[study].push(value)
      } else values[study] = [value]
      const userAttributes = {
        ...user,
        preferences: { ...preferences, [key]: values },
      }
      const [updatedUser, participantsList] = await Promise.all([
        api.users.update(uid, userAttributes),
        fetchParticipants(),
      ])

      setUser(updatedUser)
      setParticipants(participantsList)
      setNotification({ open: true, message: 'User updated successfully.' })
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const onSort = async (newSortBy, newSortDirection) => {
    setSortBy(newSortBy)
    setDirection(newSortDirection)
  }

  const handleSearch = async (formData) => {
    setSearchSubjects(formData.participants)
  }
  const normalizeSearchSubjects = (searchSubjects) =>
    searchSubjects.map(({ value }) => value)

  useEffect(() => {
    fetchParticipants().then((participantsList) => {
      if (initialLoad) {
        const dropDownOptions = participantsList.map(({ study, subject }) => ({
          value: `${subject}`,
          label: `${subject} in ${study}`,
        }))
        setSearchOptions(dropDownOptions)
        setInitialLoad(false)
      }

      setParticipants(participantsList)
    })
  }, [fetchParticipants, setParticipants, setSearchOptions])

  return (
    <Box sx={{ p: '20px' }}>
      <PageHeader
        title="Participants"
        form={
          <ParticipantsSearchForm
            onSubmit={handleSearch}
            initialValues={{
              participants: searchSubjects,
            }}
            allOptions={searchOptions}
          />
        }
      />

      <ParticipantsTable
        participants={participants}
        onStar={onStar}
        onSort={onSort}
        sortProperty={sortBy}
        sortDirection={sortDirection}
        sortable
      />
    </Box>
  )
}

export default ParticipantsPage
