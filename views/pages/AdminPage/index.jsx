import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Box,
  Button,
  Modal,
  ListItemText,
  MenuItem,
  Divider,
} from '@mui/material'
import { useForm } from 'react-hook-form'

import { UsersModel, StudiesModel } from '../../models'
import api from '../../api'
import PageHeader from '../../components/PageHeader'
import AdminUsersTable from '../../tables/AdminUsersTable'
import { AdminUsersSearchForm } from '../../forms/AdminUsersSearchForm'
import ControlledSelectInput from '../../forms/ControlledSelect'
import ControlledMultiSelect from '../../forms/ControlledMultiSelect'
import { ROLE_OPTIONS } from '../../../constants'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 720,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const AdminPage = () => {
  const { setNotification, users, setUsers } = useOutletContext()

  const [searchOptions, setSearchOptions] = useState([])
  const [studies, setStudies] = useState([])
  const [searchOptionsValue, setSearchOptionsValue] = useState([])
  const [openResetKeyModal, setOpenResetKeyModal] = useState(false)
  const [resetKeyValue, setResetKeyValue] = useState('')
  const [currentRowIndex, setCurrentRowIndex] = useState(null)
  const [openAccessModal, setOpenAccessModal] = useState(false)

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      access: [],
      role: '',
    },
    mode: 'onChange',
  })

  const filteredUsers = (searchOptionsValue || []).length
    ? users.filter((user) =>
        searchOptionsValue
          .map((searchOption) => searchOption.value)
          .includes(user.uid)
      )
    : users

  const updateUsers = (newUser) => {
    const newUserIndex = users.findIndex((u) => u.uid === newUser.uid)
    if (newUserIndex === -1) return

    const updatedUsers = users
      .slice(0, newUserIndex)
      .concat([newUser])
      .concat(users.slice(newUserIndex + 1))

    setUsers(updatedUsers)
  }

  const handleNotification = (message) =>
    setNotification({ open: true, message })
  const handleUserRemove = async (rowIndex) => {
    try {
      const userId = filteredUsers[rowIndex].uid

      await api.admin.users.destroy(userId)

      const usersList = await api.users.loadAll()

      setUsers(usersList)
      handleNotification('User has been deleted')
    } catch (error) {
      handleNotification(error.message)
    }
  }

  const handleResetPassword = async (rowIndex) => {
    try {
      const resetKey = crypto.randomUUID()
      const userValues = filteredUsers[rowIndex]
      const { uid } = userValues
      const userAttributes = {
        ...userValues,
        force_reset_pw: true,
        reset_key: resetKey,
      }
      const updatedUser = await api.admin.users.update(uid, userAttributes)
      updateUsers(updatedUser)
      setResetKeyValue(resetKey)
      setOpenResetKeyModal(true)
      handleNotification('Reset Key has been applied successfully')
    } catch (error) {
      handleNotification(error.message)
    }
  }

  const handleUserAccess = (rowIndex) => {
    setCurrentRowIndex(rowIndex)
    setOpenAccessModal(true)
    reset({
      access: filteredUsers[rowIndex].access.map((study) => ({
        label: study,
        value: study,
      })),
      role: filteredUsers[rowIndex].role,
    })
  }

  const handleUpdateUserAccess = async (formValues) => {
    try {
      formValues.access = formValues.access.map(({ value }) => value)

      const userValues = filteredUsers[currentRowIndex]
      const { uid } = userValues
      const userAttributes = {
        ...userValues,
        ...formValues,
      }
      const updatedUser = await api.admin.users.update(uid, userAttributes)

      updateUsers(updatedUser)
      setOpenAccessModal(false)
      reset({ access: [], role: '' })
      handleNotification('User access has been applied successfully')
    } catch (error) {
      handleNotification(error.message)
    }
  }

  const handleUserBlock = async (rowIndex) => {
    try {
      const userValues = filteredUsers[rowIndex]

      const userId = userValues.uid
      const updatedUser = await api.admin.users.update(userId, {
        ...userValues,
        blocked: !userValues.blocked,
      })

      updateUsers(updatedUser)

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

  const handleChangeAccountExpiration = async (rowIndex, value) => {
    try {
      const userValues = filteredUsers[rowIndex]
      const { uid } = userValues
      const userAttributes = {
        ...userValues,
        account_expires: value.toISOString(),
      }
      const updatedUser = await api.admin.users.update(uid, userAttributes)

      updateUsers(updatedUser)
      handleNotification('Account expiration has been applied successfully')
    } catch (error) {
      handleNotification(error.message)
    }
  }

  useEffect(() => {
    fetchStudies()
  }, [])

  useEffect(() => {
    const searchOptionsFromUsers = UsersModel.createUserFriendList(users)
    setSearchOptions(searchOptionsFromUsers)
  }, [users, searchOptionsValue])

  return (
    <Box sx={{ p: '20px' }}>
      <PageHeader title="Admin" />
      <AdminUsersSearchForm
        onSubmit={setSearchOptionsValue}
        allOptions={searchOptions}
      />
      <AdminUsersTable
        users={filteredUsers}
        onAccess={handleUserAccess}
        onUserBlock={handleUserBlock}
        onResetPassword={handleResetPassword}
        onDeleteUser={handleUserRemove}
        onChangeAccountExpiration={handleChangeAccountExpiration}
      />

      <Modal
        open={openResetKeyModal}
        title="Reset Key"
        onClose={() => setOpenResetKeyModal(false)}
      >
        <Box sx={modalStyle}>
          <h2>Reset Key</h2>
          <p>{resetKeyValue}</p>
        </Box>
      </Modal>

      <Modal
        open={openAccessModal}
        title="Update User Access"
        onClose={() => setOpenAccessModal(false)}
      >
        <Box sx={modalStyle}>
          <form onSubmit={handleSubmit(handleUpdateUserAccess)}>
            <ControlledMultiSelect
              name="access"
              control={control}
              options={studies}
              placeholder="Add studies for user to access"
              label="Studies"
            />

            <Divider sx={{ py: '15px' }} />

            <ControlledSelectInput
              control={control}
              name="role"
              fullWidth
              label="Role"
            >
              {ROLE_OPTIONS.map(({ value, label }) => (
                <MenuItem value={value} key={value}>
                  <ListItemText>{label}</ListItemText>
                </MenuItem>
              ))}
            </ControlledSelectInput>

            <Button type="submit">Update Access</Button>
          </form>
        </Box>
      </Modal>
    </Box>
  )
}

export default AdminPage
