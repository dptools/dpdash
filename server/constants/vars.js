export const ASC = 'ASC'
export const N_A = 'N/A'
export const TOTALS_STUDY = 'Totals'
export const EMPTY_VALUE = ''
export const STUDIES_TO_OMIT = ['files', 'combined']
export const INCLUSION_EXCLUSION_CRITERIA_FORM =
  'form_inclusionexclusion_criteria_review'
export const SOCIODEMOGRAPHICS_FORM = 'form_sociodemographics'
export const TOTAL_LABEL = 'Total'
export const SITE = 'Site'

export const ALL_SUBJECTS_MONGO_PROJECTION = {
  study: 1,
  _id: 0,
  participant: 1,
  dayData: 1,
}

export const PASSPORT_FIELDS_ATTRIBUTES = {
  usernameField: 'username',
  passwordField: 'password',
}

export const DEFAULT_PARTICIPANTS_SORT = {
  sortBy: 'participant',
  sortDirection: ASC,
}

export const ADMIN_ROLE = 'admin'
