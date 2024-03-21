import dayjs from 'dayjs'
import { ADMIN_ROLE } from '../../constants'

export const isAccountExpired = (accountExpires, role) => {
  if (role === ADMIN_ROLE) return false
  if (accountExpires === null) return true

  const today = dayjs()
  const accountExpirationTodayjs = dayjs(accountExpires)

  return accountExpirationTodayjs.isBefore(today)
}
