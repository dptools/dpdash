import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import ReactSelect from 'react-select'

import ParticipantsTable from '../components/VirtualTables/ParticipantsTable'
import { components } from '../forms/ControlledReactSelect/components'
import { useEffect } from 'react'
import api from '../api'

const asc = 'ASC'
const category = 'subject'

const HomePage = () => {
  const { user, classes, setNotification, setUser } = useOutletContext()
  const { uid, preferences } = user

  const [participants, setParticipants] = useState([])
  const [searchSubjects, setSearchSubjects] = useState([])
  const [searchOptions, setSearchOptions] = useState([])
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  })
  const [sortDirection, setDirection] = useState(asc)
  const [sortBy, setSortBy] = useState(category)
  const [rowCount, setRowcount] = useState(0)
  const handleResize = () =>
    setDimensions({ width: window.innerWidth, height: window.innerHeight })

  const fetchParticipants = async (sortParams) =>
    await api.participants.all(sortParams)

  const handleUserUpdate = async (e) => {
    try {
      const { name, value } = e.target
      console.log({ name, value })
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
      console.log(userAttributes, 'WHAT IS THIS')
      const updatedUser = await api.users.update(uid, userAttributes)
      const participantsList = await fetchParticipants({
        sortBy,
        sortDirection,
      })

      setUser(updatedUser)
      setParticipants(participantsList)
      setNotification({ open: true, message: 'User updated successfully.' })
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const sort = async ({ sortBy, sortDirection }) => {
    setSortBy(sortBy)
    setDirection(sortDirection)

    const participantList = await fetchParticipants({
      sortBy,
      sortDirection,
      searchSubjects: normalizeSearchSubjects(searchSubjects),
    })

    setParticipants(participantList)
  }

  const handleSearch = async (e) => {
    setSearchSubjects(e)

    const participantsList = await fetchParticipants({
      sortBy,
      sortDirection,
      searchSubjects: normalizeSearchSubjects(searchSubjects),
    })

    setParticipants(participantsList)
    setRowcount(participantsList.length)

    if (e.length === 0) {
      const participantsList = await fetchParticipants()

      setParticipants(participantsList)
      setRowcount(participantsList.length)
    }
  }
  const normalizeSearchSubjects = (searchSubjects) =>
    searchSubjects.map(({ value }) => value)
  useEffect(() => {
    handleResize()
    fetchParticipants().then((participantsList) => {
      const dropDownOptions = participantsList.map(({ study, subject }) => ({
        value: `${subject}`,
        label: `${subject} in ${study}`,
      }))

      setParticipants(participantsList)
      setSearchOptions(dropDownOptions)
      setRowcount(participantsList.length)
    })

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <>
      <ReactSelect
        classes={classes}
        placeholder="Search a study or participant"
        value={searchSubjects}
        onChange={handleSearch}
        options={searchOptions}
        autoFocus={true}
        components={components}
        isMulti
      />
      <ParticipantsTable
        width={dimensions.width}
        height={dimensions.height}
        rowCount={rowCount}
        participants={participants}
        user={user}
        classes={classes}
        onUpdate={handleUserUpdate}
        sort={sort}
        sortBy={sortBy}
        sortDirection={sortDirection}
      />
    </>
  )
}

export default HomePage
