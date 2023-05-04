import deepEqual from 'deep-equal'
import {
  ALL_FILTERS_ACTIVE,
  FILTER_TO_MONGO_VALUE_MAP,
  INCLUSION_EXCLUSION_CRITERIA_FORM,
  SOCIODEMOGRAPHICS_FORM,
  STUDIES_TO_OMIT,
  TRUE_STRING,
} from '../../constants'

const INDIVIDUAL_FILTERS_MONGO_PROJECTION = {
  study: 1,
  collection: 1,
  _id: 0,
  subject: 1,
}

class FiltersService {
  constructor(filters, userAccess) {
    this.filters = filters
    this.userAccess = userAccess
  }

  allFiltersActive = () => {
    return deepEqual(this.filters, ALL_FILTERS_ACTIVE)
  }

  barChartMongoQueries = () => {
    if (!this.filters) {
      return
    }
    const activeFilters = []
    const includedCriteriaFacet = {}
    const chrCritFilters = this.filters.chrcrit_part
      .filter((f) => f.value === TRUE_STRING)
      .map((filter) => FILTER_TO_MONGO_VALUE_MAP[filter.name])
    const includedExcludedFilters = this.filters.included_excluded
      .filter((f) => f.value === TRUE_STRING)
      .map((filter) => FILTER_TO_MONGO_VALUE_MAP[filter.name])
    const sexAtBirthFilters = this.filters.sex_at_birth
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
            study: { $in: this.userAccess, $nin: STUDIES_TO_OMIT },
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
            study: { $in: this.userAccess, $nin: STUDIES_TO_OMIT },
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
