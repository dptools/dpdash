import moment from 'moment'
import { ADMIN_ROLE } from '../../constants'

export const isAccountExpired = (accountExpires, role) => {
  if (role === ADMIN_ROLE) return false
  if (accountExpires === null) return true

  const today = moment()
  const accountExpirationToMoment = moment(accountExpires)

  return accountExpirationToMoment.isBefore(today)
}
