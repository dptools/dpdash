import { Navigate, useOutletContext } from 'react-router-dom'

import { ADMIN_ROLE } from '../../../constants'
import { routes } from '../../routes/routes'

const AdminCheck = ({ children }) => {
  const { user } = useOutletContext()
  const role = user.role

  return role !== ADMIN_ROLE ? <Navigate to={routes.main} /> : children
}

export default AdminCheck
