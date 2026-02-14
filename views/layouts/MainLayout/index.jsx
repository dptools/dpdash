import React, { useState, useEffect, useContext } from 'react'

import { Menu } from '@mui/icons-material'
import { IconButton, useMediaQuery } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'

import api from '../../api'
import Sidebar from '../../components/Sidebar'
import { AuthContext, NotificationContext } from '../../contexts'
import { routes } from '../../routes/routes'
import './MainLayout.css'

const MainLayout = () => {
  const isMobile = useMediaQuery('(max-width:900px)')
  const [, setNotification] = useContext(NotificationContext)
  const [user, setUser] = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const fetchUsers = async () => {
    try {
      const usersList = await api.users.loadAll()
      setUsers(usersList)
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const handleLogout = async () => {
    try {
      await api.auth.logout()

      setUser(null)
      navigate(routes.signin)
    } catch (error) {
      alert(error.message)
    }
  }
  const handleDrawerOpen = () => setDrawerOpen(!drawerOpen)
  const handleClose = () => setDrawerOpen(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="MainLayout_container">
      {isMobile && (
        <IconButton
          color="primary"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          style={{ position: 'fixed' }}
          size="small"
        >
          <Menu />
        </IconButton>
      )}
      <Sidebar
        sidebarOpen={drawerOpen}
        user={user}
        onLogout={handleLogout}
        isMobile={isMobile}
        onClose={handleClose}
      />

      <main className="MainLayout_main">
        <Outlet
          context={{
            navigate,
            setNotification,
            setUser,
            setUsers,
            user,
            users,
          }}
        />
      </main>
    </div>
  )
}
export default MainLayout
