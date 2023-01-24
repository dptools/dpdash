export const N_A = 'N/A'
export const TOTALS_STUDY = 'Totals'
export const EMPTY_VALUE = ''
export const STUDIES_TO_OMIT = ['files', 'combined']
export const TRUE_STRING = 'true'
export const FALSE_STRING = 'false'
export const INCLUSION_EXCLUSION_CRITERIA_FORM =
  'form_inclusionexclusion_criteria_review'

export const DEFAULT_CHART_FILTERS = {
  chrcrit_part: [
    { name: 'HC', value: TRUE_STRING },
    { name: 'CHR', value: TRUE_STRING },
    { name: 'Missing', value: TRUE_STRING },
  ],
  included_excluded: [
    { name: 'Included', value: TRUE_STRING },
    { name: 'Excluded', value: TRUE_STRING },
    { name: 'Missing', value: TRUE_STRING },
  ],
}

export const FILTER_TO_MONGO_VALUE_MAP = {
  HC: 2,
  CHR: 1,
  Missing: '',
  Included: 1,
  Excluded: 0,
}

export const ALL_SUBJECTS_MONGO_PROJECTION = {
  collection: 1,
  study: 1,
  _id: 0,
  subject: 1,
}