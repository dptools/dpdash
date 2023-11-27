import React, { useState, useEffect, useContext } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import Sidebar from '../../components/Sidebar'
import {
  AuthContext,
  ConfigurationsContext,
  NotificationContext,
} from '../../contexts'
import api from '../../api'
import { routes } from '../../routes/routes'
import './MainLayout.css'

const MainLayout = () => {
  const [configurations, setConfigurations] = useContext(ConfigurationsContext)
  const [, setNotification] = useContext(NotificationContext)
  const [user, setUser] = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const navigate = useNavigate()
  const fetchUsers = async () => {
    try {
      const usersList = await api.users.loadAll()
      setUsers(usersList)
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const loadAllConfigurations = async () => {
    try {
      const configurations = await api.userConfigurations.all(user.uid)

      setConfigurations(configurations)
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
  useEffect(() => {
    fetchUsers()
    loadAllConfigurations()
  }, [])

  return (
    <div className="MainLayout_container">
      <Sidebar sidebarOpen={true} user={user} onLogout={handleLogout} />

      <main className="MainLayout_main">
        <Outlet
          context={{
            configurations,
            navigate,
            setConfigurations,
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
