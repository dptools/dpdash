export const N_A = 'N/A'
export const TOTAL_LABEL = 'Total'
export const TOTALS = 'Totals'
export const DISALLOWED_STUDIES = ['combined', 'files', 'ProNET']
export const FILTER_CATEGORIES = {
  chrcrit_part: 'Cohort',
  included_excluded: 'Included Criteria',
  sex_at_birth: 'Sex At Birth',
}
export const EMAIL_REGEX = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'
export const NOTIFICATION_DEFAULT = {
  open: false,
  message: '',
}
export const ROLE_OPTIONS = [
  { value: 'admin', label: 'System Admins' },
  { value: 'manager', label: 'Study Manager' },
  { value: 'member', label: 'Member' },
]

export const SORT_DIRECTION = {
  ASC: 'ASC',
  DESC: 'DESC',
}

export const ADMIN_ROLE = 'admin'

export const SAFE_URL_PATTERN =
  /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi

export const DATA_URL_PATTERN =
  /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i

export const DATE_FORMAT = 'MM/DD/YYYY'
