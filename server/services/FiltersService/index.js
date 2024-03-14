import {
  INCLUSION_EXCLUSION_CRITERIA_FORM,
  SOCIODEMOGRAPHICS_FORM,
} from '../../constants'

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
  chrcrit_part: {
    HC: { label: 'HC', value: 1 },
    CHR: { label: 'CHR', value: 1 },
    Missing: { label: 'Missing', value: 1 },
  },
  included_excluded: {
    Included: { label: 'Included', value: 1 },
    Excluded: { label: 'Excluded', value: 0 },
    Missing: { label: 'Missing', value: 0 },
  },
  sex_at_birth: {
    Male: { label: 'Male', value: 1 },
    Female: { label: 'Female', value: 1 },
    Missing: { label: 'Missing', value: 1 },
  },
  sites: {},
}

const INCLUSION_EXCLUSION_KEY = 'included_excluded'
const CHRCRIT_KEY = 'chrcrit_part'
const DAY_DATA_KEY = 'dayData'
const SEX_AT_BIRTH_FILTER_KEY = 'sex_at_birth'
const SEX_AT_BIRTH_DOCUMENT_KEY = 'chrdemo_sexassigned'

const filterToMongoValues = (filter) => {
  return Object.values(filter)
    .filter(({ value }) => value === 1)
    .map(({ label }) => FILTER_TO_MONGO_VALUE_MAP[label])
}

class FiltersService {
  constructor(filters, allSites) {
    this._filters = filters
    this.allSites = allSites
  }

  allFiltersInactive = () => {
    const { sites, ...filters } = this.filters
    return Object.keys(filters).every((category) => {
      const filterCategory = filters[category]

      return Object.keys(filterCategory).every(
        (filterKey) => filterCategory[filterKey].value === 0
      )
    })
  }

  get filters() {
    return this._filters
      ? this.#requestedFilters()
      : {
          ...DEFAULT_FILTERS,
          sites: this.allSites.reduce((sitesObj, site) => {
            sitesObj[site] = { label: site, value: 1 }

            return sitesObj
          }, {}),
        }
  }

  get filterQueries() {
    const includedExcludedQuery = (includedValues) => ({
      [`${DAY_DATA_KEY}.${INCLUSION_EXCLUSION_KEY}`]: { $in: includedValues },
    })
    const chrChritQuery = (includedValues) => ({
      [`${DAY_DATA_KEY}.${CHRCRIT_KEY}`]: { $in: includedValues },
    })

    const sexAtBirthQuery = (includedValues) => ({
      [`${DAY_DATA_KEY}.${SEX_AT_BIRTH_DOCUMENT_KEY}`]: { $in: includedValues },
    })
    const filterQueries = []
    const filterNames = new Set(
      Object.keys(this.filters).filter(
        (catKey) =>
          Object.values(this.filters[catKey])
            .map((filter) => filter.value)
            .indexOf(1) > -1
      )
    )

    if (
      filterNames.has(INCLUSION_EXCLUSION_KEY) &&
      filterNames.has(CHRCRIT_KEY)
    ) {
      filterQueries.push({
        assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
        ...includedExcludedQuery(
          filterToMongoValues(this.filters[INCLUSION_EXCLUSION_KEY])
        ),
        ...chrChritQuery(filterToMongoValues(this.filters[CHRCRIT_KEY])),
      })
    } else if (filterNames.has(INCLUSION_EXCLUSION_KEY)) {
      filterQueries.push({
        assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
        ...includedExcludedQuery(
          filterToMongoValues(this.filters[INCLUSION_EXCLUSION_KEY])
        ),
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
        ...sexAtBirthQuery(
          filterToMongoValues(this.filters[SEX_AT_BIRTH_FILTER_KEY])
        ),
      })
    }

    return filterQueries
  }
  #requestedFilters = () => {
    const allFilters = {...DEFAULT_FILTERS, sites: this.allSites.reduce((acc, site) => {
      acc[site] = {label: site, value: 0}
      return acc
    }, {})}
    return Object.keys(allFilters).reduce((sanitizedFilters, key) => {
      sanitizedFilters[key] = Object.keys(allFilters[key]).reduce(
        (sanitizedFilters, reqFilter) => {
          if (this._filters[key] && this._filters[key][reqFilter]) {
            const { label, value } = this._filters[key][reqFilter]
            sanitizedFilters[reqFilter] = { label, value: Number(value) }
          } else {
            sanitizedFilters[reqFilter] = { label: allFilters[key][reqFilter].label, value: 0}
          }
          return sanitizedFilters
        },
        {}
      )
      return sanitizedFilters
    }, {})
  }
  get requestedSites() {
    const { sites } = this.filters

    return Object.keys(sites).filter((key) => sites[key].value === 1)
  }
}

export default FiltersService
