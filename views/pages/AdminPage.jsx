import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useOutletContext } from 'react-router-dom'
import NoSsr from '@mui/material/NoSsr'
import Select from 'react-select'

import { UsersModel, StudiesModel } from '../models'
import { components } from '../forms/ControlledReactSelect/components'
import api from '../api'
import AdminForm from '../forms/AdminForm'
import * as TableHelpers from '../components/VirtualTables/helpers'

const AdminPage = () => {
  const usersKey = 'users'
  const { user, setNotification, users, setUsers } = useOutletContext()

  const [searchOptions, setSearchOptions] = useState([])
  const [rowCount, setRowCount] = useState(0)
  const [studies, setStudies] = useState([])
  const [searchOptionsValue, setSearchOptionsValue] = useState([])
  const [openResetKeyModal, setOpenResetKeyModal] = useState(false)
  const [resetKeyValue, setResetKeyValue] = useState('')
  const [currentRowIndex, setCurrentRowIndex] = useState(null)
  const [openAccessModal, setOpenAccessModal] = useState(false)
  const [dimensions, setDimension] = useState({ height: 0, width: 0 })
  const { control, getValues, setValue } = useForm()
  const { fields, update } = useFieldArray({ control, name: usersKey })

  const handleNotification = (message) =>
    setNotification({ open: true, message })
  const handleUserRemove = async (rowIndex) => {
    try {
      const userId = getUserValues(rowIndex).uid

      await api.admin.users.destroy(userId)

      const usersList = await api.users.loadAll()

      setUsers(usersList)
      handleNotification('User has been deleted')
    } catch (error) {
      handleNotification(error.message)
    }
  }
  const handleResize = () =>
    setDimension({
      width: window.innerWidth - 24,
      height: window.innerHeight,
    })
  const handleResetPassword = async (rowIndex) => {
    try {
      const resetKey = crypto.randomUUID()
      const userValues = getUserValues(rowIndex)
      const { uid } = userValues
      const userFromValues = UsersModel.userFromFormValues(userValues)
      const userAttributes = {
        ...userFromValues,
        force_reset_pw: true,
        reset_key: resetKey,
      }
      const updatedUser = await api.admin.users.update(uid, userAttributes)
      const formValues = UsersModel.formValuesFromUser(updatedUser)

      setValue(`users.${rowIndex}`, formValues)
      setResetKeyValue(resetKey)
      setOpenResetKeyModal(true)
      handleNotification('Reset Key has been applied successfully')
    } catch (error) {
      handleNotification(error.message)
    }
  }
  const handleUserRole = (rowIndex) => {
    setOpenAccessModal(true)
    setCurrentRowIndex(rowIndex)
  }
  const handleClose = () => {
    setResetKeyValue('')
    setOpenResetKeyModal(false)
    setOpenAccessModal(false)
    setCurrentRowIndex(null)
  }
  const handleUserUpdate = async (rowIndex) => {
    try {
      const userValues = getUserValues(rowIndex)

      const userId = userValues.uid
      const userAttributes = UsersModel.userFromFormValues(userValues)
      const updatedUser = await api.admin.users.update(userId, userAttributes)
      const userToFormValues = UsersModel.formValuesFromUser(updatedUser)

      updateUserInForm(rowIndex, userToFormValues)
      handleClose()
      handleNotification('User updated successfully')
    } catch (error) {
      handleNotification(error.message)
    }
  }
  const fetchStudies = async () => {
    try {
      const listOfStudies = await api.admin.studies.all()
      const studyOptions = StudiesModel.dropdownSelectOptions(listOfStudies)

      setStudies(studyOptions)
    } catch (error) {
      handleNotification(error.message)
    }
  }
  const getUserValues = (rowIndex) => getValues(usersKey)[rowIndex]

  const updateUserInForm = (rowIndex, updatedUser) =>
    update(rowIndex, updatedUser)

  useEffect(() => {
    handleResize()
    fetchStudies()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const searchOptionsFromUsers = UsersModel.createUserFriendList(users)
    const createFormValuesFromUsers =
      users.map((user) => {
        return {
          ...user,
          role: { value: user.role, label: user.role },
          access: UsersModel.userAccessDropdownOptions(user.access),
        }
      }) || []

    setSearchOptions(searchOptionsFromUsers)
    setValue(usersKey, createFormValuesFromUsers)
    setRowCount(TableHelpers.calculateRowCount(users, searchOptionsValue))
  }, [users, searchOptionsValue])

  return (
    <>
      <NoSsr>
        <Select
          autoFocus={true}
          components={components}
          isMulti
          onChange={(e) => setSearchOptionsValue(e)}
          options={searchOptions}
          placeholder="Search users now"
          value={searchOptionsValue}
        />
      </NoSsr>
      <AdminForm
        control={control}
        currentRowIndex={currentRowIndex}
        height={dimensions.height}
        onClose={handleClose}
        options={studies}
        onAccess={handleUserRole}
        onDeleteUser={handleUserRemove}
        onResetPassword={handleResetPassword}
        onUpdateUser={handleUserUpdate}
        openAccessFields={openAccessModal}
        openResetKeyFields={openResetKeyModal}
        resetKey={resetKeyValue}
        rowCount={rowCount}
        rowClassName={TableHelpers.rowClassName}
        user={user}
        users={fields}
        userValues={
          currentRowIndex === null ? undefined : getUserValues(currentRowIndex)
        }
        width={dimensions.width}
      />
    </>
  )
}

export default AdminPage
