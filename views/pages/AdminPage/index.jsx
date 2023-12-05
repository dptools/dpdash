import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Box, Button, Modal } from '@mui/material'

import { UsersModel, StudiesModel } from '../../models'
import api from '../../api'
import PageHeader from '../../components/PageHeader'
import AdminUsersTable from '../../tables/AdminUsersTable'
import { AdminUsersSearchForm } from '../../forms/AdminUsersSearchForm'
import { MultiSelect } from '../../forms/MultiSelect'

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
};

const AdminPage = () => {
  const usersKey = 'users'
  const { user, setNotification, users, setUsers } = useOutletContext()

  const [searchOptions, setSearchOptions] = useState([])
  const [studies, setStudies] = useState([])
  const [searchOptionsValue, setSearchOptionsValue] = useState([])
  const [currentUserAccess, setCurrentUserAccess] = useState([])
  const [openResetKeyModal, setOpenResetKeyModal] = useState(false)
  const [resetKeyValue, setResetKeyValue] = useState('')
  const [currentRowIndex, setCurrentRowIndex] = useState(null)
  const [openAccessModal, setOpenAccessModal] = useState(false)

  const filteredUsers = (searchOptionsValue || []).length ?
    users.filter(user => searchOptionsValue.map(searchOption => searchOption.value).includes(user.uid)) :
    users

  const updateUsers = (newUser) => {
    const newUserIndex = users.findIndex(u => u.uid === newUser.uid) 
    if (newUserIndex === -1) return

    setUsers(users.slice(0, newUserIndex).concat([newUser]).concat(users.slice(newUserIndex + 1)))
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
    setCurrentUserAccess(filteredUsers[rowIndex].access)
    setCurrentRowIndex(rowIndex)
    setOpenAccessModal(true)
  }

  const handleUpdateUserAccess = async (e) => {
    e.preventDefault()

    try {
      const userValues = filteredUsers[currentRowIndex]
      const { uid } = userValues
      const userAttributes = {
        ...userValues,
        access: currentUserAccess,
      }
      const updatedUser = await api.admin.users.update(uid, userAttributes)

      updateUsers(updatedUser)
      setOpenAccessModal(false)
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
      <AdminUsersSearchForm onSubmit={setSearchOptionsValue} allOptions={searchOptions} />
      <AdminUsersTable  users={filteredUsers}
                        onAccess={handleUserAccess} 
                        onUserBlock={handleUserBlock} 
                        onResetPassword={handleResetPassword} 
                        onDeleteUser={handleUserRemove} 
                        onChangeAccountExpiration={handleChangeAccountExpiration}/>
      
      <Modal open={openResetKeyModal}
             title="Reset Key" 
             onClose={() => setOpenResetKeyModal(false)}>
        <Box sx={modalStyle}>
          <h2>Reset Key</h2>
          <p>{resetKeyValue}</p>
        </Box>
      </Modal>

      <Modal open={openAccessModal}
             title="Update User Access"
             onClose={() => setOpenAccessModal(false)}>
        <Box sx={modalStyle}>
          <form onSubmit={handleUpdateUserAccess}>
            <MultiSelect value={currentUserAccess.map(a => ({ value: a, label: a }))} 
                          name="access" 
                          options={studies}
                          onChange={(selections) => setCurrentUserAccess(selections.map(s => s.value))}
                          placeholder="Add studies for user to access" />
            <Button type="submit">Update Access</Button>
          </form>
        </Box>
      </Modal>
    </Box>
  )
}

export default AdminPage
