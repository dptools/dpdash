export const N_A = 'N/A'
export const TOTAL_LABEL = 'Total'
export const TOTALS = 'Totals'
export const DISALLOWED_STUDIES = ['combined', 'files']
export const FILTER_CATEGORIES = {
  chrcrit_part: 'Cohort',
  included_excluded: 'Included Criteria',
  sex_at_birth: 'Sex At Birth',
}
export const TRUE_STRING = 'true'
export const FALSE_STRING = 'false'
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
export const VALIDATION_EMAIL_REGEX = new RegExp(
  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,63}$/g
)
export const ADMIN_ROLE = 'admin'
