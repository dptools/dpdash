import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { routes } from '../routes/routes'
import api from '../api'

const AuthenticatedRoute = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useContext(AuthContext)

  const fetchUser = async () => {
    try {
      const currentUser = await api.auth.me()
      setUser(currentUser)
    } catch (error) {
      navigate(routes.login)
    }
  }

  useEffect(() => {
    if (!user) fetchUser()
  }, [])

  return user ? children : <div>Loading...</div>
}

export default AuthenticatedRoute
