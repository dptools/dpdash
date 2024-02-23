import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import api from '../api'
import useTableSort from './useTableSort'

const participant = 'participant'

export default function useParticipantsList() {
  const { user, setNotification, setUser } = useOutletContext()
  const { onSort, sortDirection, sortBy } = useTableSort(participant)
  const { uid, preferences, access } = user

  const [initialLoad, setInitialLoad] = useState(true)
  const [loading, setLoading] = useState(true)
  const [participants, setParticipants] = useState([])
  const [formFilters, setFormFilters] = useState({
    searchParticipants: [],
    studies: [],
    status: undefined,
  })
  const [searchOptions, setSearchOptions] = useState({
    participants: [],
    studies: access.map((study) => ({ label: study, value: study })),
  })

  const fetchParticipants = React.useCallback(async () => {
    const sortParams = {
      ...(sortBy ? { sortBy } : {}),
      ...(sortDirection ? { sortDirection } : {}),
      ...(formFilters.searchParticipants.length
        ? {
            searchParticipants: normalizeSearchParticipants(
              formFilters.searchParticipants
            ),
          }
        : {}),
      ...(formFilters?.status || formFilters?.status === 0
        ? { status: formFilters.status }
        : {}),
      ...(formFilters.studies?.length ? { studies: formFilters.studies } : {}),
    }

    return await api.participants.all(sortParams)
  }, [sortBy, sortDirection, formFilters])

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
      const updatedUser = await api.users.update(uid, userAttributes)
      const participantsList = await fetchParticipants()

      setUser(updatedUser)
      setParticipants(participantsList)
      setNotification({ open: true, message: 'User updated successfully.' })
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

  const handleSearch = async (formData) => {
    const { studies, participants, status } = formData

    setFormFilters({
      searchParticipants: participants,
      studies,
      status,
    })
    setLoading(true)
  }

  const normalizeSearchParticipants = (searchParticipants) =>
    searchParticipants.map(({ value }) => value)

  useEffect(() => {
    fetchParticipants().then((participantsList) => {
      if (initialLoad) {
        const dropDownOptions = participantsList.map(
          ({ study, participant }) => ({
            value: `${participant}`,
            label: `${participant} in ${study}`,
          })
        )
        setSearchOptions((prevState) => ({
          ...prevState,
          participants: dropDownOptions,
        }))
        setInitialLoad(false)
      }

      setParticipants(participantsList)
      setLoading(false)
    })
  }, [fetchParticipants, setParticipants, setSearchOptions])

  return {
    formFilters,
    handleSearch,
    loading,
    onStar,
    onSort,
    participants,
    sortDirection,
    sortBy,
    searchOptions,
  }
}
