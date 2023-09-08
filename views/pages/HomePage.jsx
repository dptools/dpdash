import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Select from 'react-select'

import ParticipantsTable from '../components/VirtualTables/ParticipantsTable'
import { components } from '../forms/ControlledReactSelect/components'
import { ParticipantsModel } from '../models'
import { useEffect } from 'react'
import api from '../api'
import * as TableHelpers from '../components/VirtualTables/helpers'

const asc = 'ASC'
const desc = 'DESC'
const category = 'subject'

const HomePage = () => {
  const { user, classes, setNotification, setUser } = useOutletContext()
  const { uid, preferences } = user

  const [participants, setParticipants] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [searchOptions, setSearchOptions] = useState([])
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  })
  const [direction, setDirection] = useState(asc)
  const [sortCategory, setSortBy] = useState(category)
  const [rowCount, setRowcount] = useState(0)
  const handleResize = () =>
    setDimensions({ width: window.innerWidth, height: window.innerHeight })

  const fetchParticipants = async () => {
    const participantsList = await api.participants.all()

    setParticipants(
      ParticipantsModel.setStarredAndComplete(
        participantsList,
        preferences,
        sortCategory,
        direction
      )
    )
  }

  const handleUserUpdate = async (e) => {
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
        preferences: { ...preferences, [key]: values },
      }
      const updatedUser = await api.users.update(uid, userAttributes)

      setUser(updatedUser)

      if (searchResults.length) {
        const updatedParticipants = ParticipantsModel.setStarredAndComplete(
          participants,
          updatedUser.preferences,
          sortCategory,
          direction
        )

        setParticipants(
          ParticipantsModel.sortWithSearch(
            updatedParticipants,
            results,
            direction,
            sortCategory
          )
        )
      } else {
        setParticipants(
          ParticipantsModel.setStarredAndComplete(
            participants,
            updatedUser.preferences,
            sortCategory,
            direction
          )
        )
      }
      setNotification({ open: true, message: 'User updated successfully.' })
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const sort = ({ sortBy, sortDirection }) => {
    setSortBy(sortBy)
    setDirection(sortDirection)

    if (sortDirection === asc) {
      const sortedList = ParticipantsModel.sortAscWithPriority(
        participants,
        preferences?.star,
        sortBy
      )

      setParticipants(sortedList)
    }
    if (sortDirection === desc) {
      const sortedList = ParticipantsModel.sortDescWithPriority(
        participants,
        preferences?.star,
        sortBy
      )

      setParticipants(sortedList)
    }
  }

  useEffect(() => {
    handleResize()
    fetchParticipants()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (participants.length)
      setSearchOptions(ParticipantsModel.selectDropdownOptions(participants))

    setRowcount(TableHelpers.calculateRowCount(participants, searchResults))

    if (searchResults.length) {
      const sortedWithSearch = ParticipantsModel.sortWithSearch(
        participants,
        searchResults,
        direction,
        sortCategory
      )
      setParticipants(sortedWithSearch)
    }
  }, [participants, searchResults])

  return (
    <>
      <Select
        classes={classes}
        placeholder="Search a study or participant"
        value={searchResults}
        onChange={(e) => setSearchResults(e)}
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
        sortBy={sortCategory}
        sortDirection={direction}
      />
    </>
  )
}

export default HomePage
