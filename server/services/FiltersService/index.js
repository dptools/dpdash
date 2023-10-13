import {
  INCLUSION_EXCLUSION_CRITERIA_FORM,
  SOCIODEMOGRAPHICS_FORM,
  TRUE_STRING,
  FALSE_STRING,
} from '../../constants'
import StudiesModel from '../../models/StudiesModel'

const FILTER_TO_MONGO_VALUE_MAP = {
  HC: 2,
  CHR: 1,
  Missing: '',
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
  sites: [],
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

  get sites() {
    return this.filters.sites
  }

  get filters() {
    const unsanitizedSites =
      this._filters.sites.length > 0 ? this._filters.sites : this.allSites

    return {
      ...this._filters,
      sites: StudiesModel.sanitizeAndSort(unsanitizedSites),
    }
  }

  barChartMongoQueries = () => {
    const filters = this.filters
    const activeFilters = []
    const includedCriteriaFacet = {}
    const chrCritFilters = filters.chrcrit_part
      .filter((f) => f.value === TRUE_STRING)
      .map((filter) => FILTER_TO_MONGO_VALUE_MAP[filter.name])
    const includedExcludedFilters = filters.included_excluded
      .filter((f) => f.value === TRUE_STRING)
      .map((filter) => FILTER_TO_MONGO_VALUE_MAP[filter.name])
    const sexAtBirthFilters = filters.sex_at_birth
      .filter((f) => f.value === TRUE_STRING)
      .map((filter) => FILTER_TO_MONGO_VALUE_MAP[filter.name])

    if (!!chrCritFilters.length) {
      includedCriteriaFacet.chrcrit_part = [
        {
          $match: { chrcrit_part: { $in: chrCritFilters } },
        },
      ]
      activeFilters.push('chrcrit_part')
    }

    if (!!includedExcludedFilters.length) {
      includedCriteriaFacet.included_excluded = [
        {
          $match: { included_excluded: { $in: includedExcludedFilters } },
        },
      ]
      activeFilters.push('included_excluded')
    }

    if (!!sexAtBirthFilters.length) {
      activeFilters.push('sex_at_birth')
    }

    return {
      mongoAggregateQueryForIncludedCriteria: [
        { $facet: includedCriteriaFacet },
      ],
      mongoAggregateQueryForFilters: [
        {
          $facet: this._buildFacetForFilters({
            isSexAtBirthFilterActive: !!sexAtBirthFilters.length,
            isInclusionCriteriaFilterActive:
              !!chrCritFilters.length || !!includedExcludedFilters.length,
          }),
        },
      ],
      mongoQueryForSocioDemographics: {
        chrdemo_sexassigned: { $in: sexAtBirthFilters },
      },
      activeFilters,
    }
  }

  _buildFacetForFilters = ({
    isSexAtBirthFilterActive,
    isInclusionCriteriaFilterActive,
  }) => {
    const facetForFilters = {}

    if (isSexAtBirthFilterActive) {
      facetForFilters.socioDemographics = [
        {
          $match: {
            assessment: SOCIODEMOGRAPHICS_FORM,
            study: { $in: this.sites },
          },
        },
        {
          $project: {
            ...INDIVIDUAL_FILTERS_MONGO_PROJECTION,
          },
        },
        {
          $addFields: {
            filter: SOCIODEMOGRAPHICS_FORM,
          },
        },
      ]
    }
    if (isInclusionCriteriaFilterActive) {
      facetForFilters.inclusionCriteria = [
        {
          $match: {
            assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
            study: { $in: this.sites },
          },
        },
        {
          $project: {
            ...INDIVIDUAL_FILTERS_MONGO_PROJECTION,
          },
        },
        {
          $addFields: {
            filter: INCLUSION_EXCLUSION_CRITERIA_FORM,
          },
        },
      ]
    }

    return facetForFilters
  }
}

export default FiltersService
