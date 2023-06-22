import moment from 'moment'

export const isAccountExpired = (accountExpires) => {
  const today = moment()
  const accountExpirationToMoment = moment(accountExpires)

  return accountExpirationToMoment.isBefore(today)
}
