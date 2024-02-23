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

  barChartMongoQueries = () => {
    const filters = this.filters
    const $facet = {}
    const chrCritFilters = filters.chrcrit_part
      .filter((f) => f.value === TRUE_STRING)
      .map((filter) => FILTER_TO_MONGO_VALUE_MAP[filter.name])
    const includedExcludedFilters = filters.included_excluded
      .filter((f) => f.value === TRUE_STRING)
      .map((filter) => FILTER_TO_MONGO_VALUE_MAP[filter.name])
    const sexAtBirthFilters = filters.sex_at_birth
      .filter((f) => f.value === TRUE_STRING)
      .map((filter) => FILTER_TO_MONGO_VALUE_MAP[filter.name])

    const isIncOrExcOnly =
      !chrCritFilters.length && includedExcludedFilters.length
    const isCritOnly = chrCritFilters.length && !includedExcludedFilters.length
    const isIncAndCrit = chrCritFilters.length && includedExcludedFilters.length

    if (isIncAndCrit) {
      $facet.formInclusion = [
        {
          $match: {
            assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
            $and: [
              {
                dayData: {
                  $elemMatch: { chrcrit_part: { $in: chrCritFilters } },
                },
              },
              {
                dayData: {
                  $elemMatch: {
                    included_excluded: { $in: includedExcludedFilters },
                  },
                },
              },
            ],
            study: { $in: this.filters.sites },
          },
        },
      ]
    }
    if (isIncOrExcOnly || isCritOnly) {
      const variable = chrCritFilters.length
        ? 'chrcrit_part'
        : 'included_excluded'
      const values = chrCritFilters.length
        ? chrCritFilters
        : includedExcludedFilters

      $facet.formInclusion = [
        {
          $match: {
            assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
            study: {
              $in: this.filters.sites,
            },
            dayData: {
              $elemMatch: { [variable]: { $in: values } },
            },
          },
        },
      ]
    }
    if (sexAtBirthFilters.length) {
      $facet.sexAtBirth = [
        {
          $match: {
            assessment: SOCIODEMOGRAPHICS_FORM,
            dayData: {
              $elemMatch: {
                chrdemo_sexassigned: { $in: sexAtBirthFilters },
              },
            },
          },
        },
      ]
    }
    return Object.keys($facet).length > 1
      ? [
          { $facet },
          {
            $project: {
              participants: {
                $setIntersection: [
                  '$formInclusion.participant',
                  '$sexAtBirth.participant',
                ],
              },
            },
          },
        ]
      : $facet
  }

  _buildFacetForFilters = ({
    isSexAtBirthFilterActive,
    isInclusionCriteriaFilterActive,
    sites,
  }) => {
    const facetForFilters = {}
    if (isSexAtBirthFilterActive) {
      facetForFilters.socioDemographics = [
        {
          $match: {
            assessment: SOCIODEMOGRAPHICS_FORM,
            study: { $in: sites },
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
            study: { $in: sites },
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
