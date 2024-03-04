import {
  INCLUSION_EXCLUSION_CRITERIA_FORM,
  SOCIODEMOGRAPHICS_FORM,
  TRUE_STRING,
  FALSE_STRING,
} from '../../constants'
import StudiesModel from '../../models/StudiesModel'

export const FILTER_TO_MONGO_VALUE_MAP = {
  HC: 2,
  CHR: 1,
  Missing: null,
  Included: 1,
  Excluded: 0,
  Male: 1,
  Female: 2,
}

export const INDIVIDUAL_FILTERS_MONGO_PROJECTION = {
  study: 1,
  collection: 1,
  _id: 0,
  subject: 1,
}

export const DEFAULT_FILTERS = {
  chrcrit_part: [
    { name: 'HC', value: TRUE_STRING },
    { name: 'CHR', value: TRUE_STRING },
    { name: 'Missing', value: TRUE_STRING },
  ],
  included_excluded: [
    { name: 'Included', value: TRUE_STRING },
    { name: 'Excluded', value: FALSE_STRING },
    { name: 'Missing', value: FALSE_STRING },
  ],
  sex_at_birth: [
    { name: 'Male', value: TRUE_STRING },
    { name: 'Female', value: TRUE_STRING },
    { name: 'Missing', value: TRUE_STRING },
  ],
  sites: {},
}

const INCLUSION_EXCLUSION_KEY = 'included_excluded'
const CHRCRIT_KEY = 'chrcrit_part'
const DAY_DATA_KEY = 'dayData'
const SEX_AT_BIRTH_FILTER_KEY = 'sex_at_birth'
const SEX_AT_BIRTH_DOCUMENT_KEY = 'chrdemo_sexassigned'

const filterToMongoValues = (filter) => {
  return filter.filter(({ value }) => value === TRUE_STRING).map(({ name }) => FILTER_TO_MONGO_VALUE_MAP[name])
}

class FiltersService {
  constructor(filters, allSites) {
    this._filters = filters || DEFAULT_FILTERS
    this.allSites = allSites || []
  }

  allFiltersInactive = () => {
    const { sites, ...filters } = this.filters

    return Object.keys(filters).every((filterKey) =>
      filters[filterKey].every((filter) => filter.value === FALSE_STRING)
    )
  }

  get filters() {
    const filtersSites = Object.values(this._filters.sites)
    const unsanitizedSites =
      filtersSites.length > 0 ? filtersSites : this.allSites
    return {
      ...this._filters,
      sites: StudiesModel.sanitizeAndSort(unsanitizedSites),
    }
  }

  get filterQueries() {
    const includedExcludedQuery = (includedValues) => ({[ `${DAY_DATA_KEY}.${INCLUSION_EXCLUSION_KEY}`]: { $in: includedValues } })
    const chrChritQuery = (includedValues) => ({[ `${DAY_DATA_KEY}.${CHRCRIT_KEY}`]: { $in: includedValues } })

    const sexAtBirthQuery = (includedValues) => ({ [`${DAY_DATA_KEY}.${SEX_AT_BIRTH_DOCUMENT_KEY}`]: {$in: includedValues } })

    const filterQueries = []
    const filterNames = new Set(Object.keys(this.filters).filter(key => (this.filters[key].map(f => f.value).indexOf(TRUE_STRING) > -1)))

    if (filterNames.has(INCLUSION_EXCLUSION_KEY) && filterNames.has(CHRCRIT_KEY)) {
      filterQueries.push({
        assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
        ...includedExcludedQuery(filterToMongoValues(this.filters[INCLUSION_EXCLUSION_KEY])),
        ...chrChritQuery(filterToMongoValues(this.filters[CHRCRIT_KEY]))
      })
    } else if (filterNames.has(INCLUSION_EXCLUSION_KEY)) {
      filterQueries.push({
        assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
        ...includedExcludedQuery(filterToMongoValues(this.filters[INCLUSION_EXCLUSION_KEY])),
      })
    } else if (filterNames.has(CHRCRIT_KEY)) {
      filterQueries.push({
        assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
        ...chrChritQuery(filterToMongoValues(this.filters[CHRCRIT_KEY])),
      })
    }

    if (filterNames.has(SEX_AT_BIRTH_FILTER_KEY)) {
      filterQueries.push({
        assessment: SOCIODEMOGRAPHICS_FORM,
        ...sexAtBirthQuery(filterToMongoValues(this.filters[SEX_AT_BIRTH_FILTER_KEY]))
      })
    }

    return filterQueries
  }
}

export default FiltersService
