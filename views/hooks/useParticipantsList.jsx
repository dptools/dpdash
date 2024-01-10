import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import api from '../api'
import { SORT_DIRECTION } from '../../constants'

const subject = 'subject'

export default function useParticipantsList() {
  const { user, setNotification, setUser } = useOutletContext()
  const { uid, preferences, access } = user

  const [initialLoad, setInitialLoad] = useState(true)
  const [loading, setLoading] = useState(true)
  const [participants, setParticipants] = useState([])
  const [formFilters, setFormFilters] = useState({
    searchSubjects: [],
    studies: [],
    status: '',
  })
  const [searchOptions, setSearchOptions] = useState({
    participants: [],
    studies: access.map((study) => ({ label: study, value: study })),
  })
  const [sortDirection, setDirection] = useState(SORT_DIRECTION.ASC)
  const [sortBy, setSortBy] = useState(subject)

  const fetchParticipants = React.useCallback(async () => {
    const sortParams = {
      ...(sortBy ? { sortBy } : {}),
      ...(sortDirection ? { sortDirection } : {}),
      ...(formFilters.searchSubjects.length
        ? {
            searchSubjects: normalizeSearchSubjects(formFilters.searchSubjects),
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
    const { studies, participants, status } = formData

    setFormFilters({
      searchSubjects: participants,
      studies,
      status,
    })
    setLoading(true)
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
