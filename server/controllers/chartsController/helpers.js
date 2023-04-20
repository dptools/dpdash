import { SITE_NAMES } from '../../utils/siteNames'
import {
  N_A,
  TOTALS_STUDY,
  FILTER_TO_MONGO_VALUE_MAP,
  TRUE_STRING,
  SOCIODEMOGRAPHICS_FORM,
  INCLUSION_EXCLUSION_CRITERIA_FORM,
  STUDIES_TO_OMIT,
  TOTAL_LABEL,
  SITE,
} from '../../constants'

export const isAnyTargetIncluded = (studyTotals) => {
  return Object.keys(studyTotals)
    .filter((site) => site !== TOTALS_STUDY)
    .some((site) => studyTotals[site]?.targetTotal !== undefined)
}
const INDIVIDUAL_FILTERS_MONGO_PROJECTION = {
  study: 1,
  collection: 1,
  _id: 0,
  subject: 1,
}
const calculateStudySectionTargetValue = (
  studySectionTotalTarget,
  studySectionTotalCount
) => {
  if (
    !!studySectionTotalTarget &&
    studySectionTotalTarget > studySectionTotalCount
  ) {
    return +studySectionTotalTarget
  }

  return +studySectionTotalCount || 0
}

const calculateTotalsTargetValue = (currentTargetCount, nextTargetCount) =>
  !!currentTargetCount
    ? +currentTargetCount + +nextTargetCount
    : +nextTargetCount

const studyCountsToPercentage = (studyCount, targetTotal) => {
  if (!targetTotal || Number.isNaN(+studyCount) || Number.isNaN(+targetTotal)) {
    return 0
  }

  return (+studyCount / +targetTotal) * 100
}

export const studyTargetTotal = (studyTotals, newTargetValue) => {
  if (studyTotals) {
    if (studyTotals.targetTotal === undefined) {
      return studyTotals
    }

    return {
      ...studyTotals,
      targetTotal: !!newTargetValue
        ? studyTotals.targetTotal + newTargetValue
        : undefined,
    }
  } else {
    return {
      count: 0,
      targetTotal: newTargetValue,
    }
  }
}

export const totalStudyTargetValue = (
  totalsStudyTargetTotal,
  siteTargetValue
) => {
  if (totalsStudyTargetTotal === undefined) {
    return totalsStudyTargetTotal
  }

  return !!siteTargetValue
    ? totalsStudyTargetTotal + siteTargetValue
    : undefined
}

export const generateStudyTargetTotals = (chart, allowedStudies) => {
  const studyTotals = {
    [TOTALS_STUDY]: {
      count: 0,
      targetTotal: 0,
    },
  }
  chart.fieldLabelValueMap.forEach((fieldLabelValueMap) => {
    const { targetValues } = fieldLabelValueMap

    allowedStudies.forEach((study) => {
      const siteName = SITE_NAMES[study] || study
      const rawNewTargetValue = targetValues[study]
      const newTargetValue = !!rawNewTargetValue
        ? +rawNewTargetValue
        : undefined

      studyTotals[siteName] = studyTargetTotal(
        studyTotals[siteName],
        newTargetValue
      )

      if (targetValues.hasOwnProperty(study)) {
        studyTotals[TOTALS_STUDY].targetTotal = totalStudyTargetValue(
          studyTotals[TOTALS_STUDY].targetTotal,
          newTargetValue
        )
      }
    })
  })

  return studyTotals
}

export const processData = ({
  shouldCountSubject,
  dataMap,
  dataKey,
  totalsDataKey,
  variableCount,
}) => {
  if (shouldCountSubject) {
    const existingData = dataMap.get(dataKey)
    const existingTotalsData = dataMap.get(totalsDataKey)

    if (existingData) {
      dataMap.set(dataKey, existingData + variableCount)
    } else {
      dataMap.set(dataKey, variableCount)
    }

    if (existingTotalsData) {
      dataMap.set(totalsDataKey, existingTotalsData + variableCount)
    } else {
      dataMap.set(totalsDataKey, variableCount)
    }
  } else {
    if (!dataMap.get(dataKey)) {
      dataMap.set(dataKey, 0)
    }
  }
}

export const processTotals = ({
  shouldCountSubject,
  studyTotals,
  siteName,
  targetValue,
  variableCount,
}) => {
  if (shouldCountSubject) {
    if (studyTotals[siteName]) {
      studyTotals[siteName].count += variableCount
    } else {
      studyTotals[siteName] = {
        count: variableCount,
        targetValue,
      }
    }
    studyTotals[TOTALS_STUDY].count += variableCount
  }
}

export const postProcessData = (data, studyTotals) => {
  const processedDataBySite = new Map()
  const totalsValueTargets = {}

  for (const [key, count] of data) {
    const [study, valueLabel, targetValue] = key.split('-')
    const totalsForStudy = studyTotals[study]
    const totals = totalsForStudy.targetTotal || totalsForStudy.count
    const percent = studyCountsToPercentage(count, totals)
    const existingEntriesForStudy = processedDataBySite.get(study)
    const targetValueAsNumber = +targetValue
    const targetValueIsNan = Number.isNaN(targetValueAsNumber)
    const hasTargetValue =
      !!targetValue && !targetValueIsNan && study !== TOTALS_STUDY
    const isTargetValueMissing = !targetValue && study !== TOTALS_STUDY

    if (hasTargetValue) {
      totalsValueTargets[valueLabel] = calculateTotalsTargetValue(
        totalsValueTargets[valueLabel],
        targetValue
      )
    }

    if (isTargetValueMissing) {
      totalsValueTargets[valueLabel] = calculateTotalsTargetValue(
        totalsValueTargets[valueLabel],
        totalsForStudy.count
      )
    }

    if (existingEntriesForStudy) {
      processedDataBySite.set(study, {
        ...existingEntriesForStudy,
        counts: {
          ...existingEntriesForStudy.counts,
          [valueLabel]: count,
        },
        percentages: {
          ...existingEntriesForStudy.percentages,
          [valueLabel]: percent,
        },
        targets: {
          ...existingEntriesForStudy.targets,
          [valueLabel]: targetValueIsNan ? undefined : +targetValueAsNumber,
        },
      })
    } else {
      processedDataBySite.set(study, {
        name: study,
        counts: {
          [valueLabel]: count,
        },
        totalsForStudy,
        percentages: {
          [valueLabel]: percent,
        },
        targets: {
          [valueLabel]: targetValueIsNan ? undefined : +targetValueAsNumber,
        },
      })
    }
  }

  for (const [study, values] of processedDataBySite) {
    const { targetTotal, count: currentSiteCount } = studyTotals[study]
    const isTargetGreaterThanCount =
      targetTotal && targetTotal > currentSiteCount
    const count = isTargetGreaterThanCount ? targetTotal - currentSiteCount : 0
    const studySectionTargetValue = calculateStudySectionTargetValue(
      targetTotal,
      currentSiteCount
    )
    const percent = studyCountsToPercentage(count, studySectionTargetValue)

    processedDataBySite.set(study, {
      ...values,
      counts: {
        ...values.counts,
        [N_A]: count,
      },
      percentages: {
        ...values.percentages,
        [N_A]: percent,
      },
    })
  }

  const processedTotals = processedDataBySite.get(TOTALS_STUDY)
  processedDataBySite.set(TOTALS_STUDY, {
    ...processedTotals,
    targets: totalsValueTargets,
  })

  return processedDataBySite
}

export const mongoQueriesFromFilters = (filters, userAccess) => {
  if (!filters) {
    return
  }
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
      {
        $facet: includedCriteriaFacet,
      },
    ],
    mongoAggregateQueryForFilters: [
      {
        $facet: buildFacetForFilters({
          isSexAtBirthFilterActive: !!sexAtBirthFilters.length,
          isInclusionCriteriaFilterActive:
            !!chrCritFilters.length || !!includedExcludedFilters.length,
          userAccess,
        }),
      },
    ],
    mongoQueryForSocioDemographics: {
      chrdemo_sexassigned: { $in: sexAtBirthFilters },
    },
    activeFilters,
  }
}

export const calculateSubjectVariableDayCount = (
  subjectAssessmentDayData,
  chartVariable,
  chartValue
) => {
  const isChartVariableNaN = isNaN(chartValue)
  const variableValue = isChartVariableNaN ? chartValue : +chartValue
  const subjectsDayDataAndVariable = subjectAssessmentDayData.filter(
    (dayData) => dayData[chartVariable] === variableValue
  )

  return subjectsDayDataAndVariable.length
}

export const buildFacetForFilters = ({
  isSexAtBirthFilterActive,
  isInclusionCriteriaFilterActive,
  userAccess,
}) => {
  const facetForFilters = {}

  if (isSexAtBirthFilterActive) {
    facetForFilters.socioDemographics = [
      {
        $match: {
          assessment: SOCIODEMOGRAPHICS_FORM,
          study: { $in: userAccess, $nin: STUDIES_TO_OMIT },
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
          study: { $in: userAccess, $nin: STUDIES_TO_OMIT },
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

export const intersectSubjectsFromFilters = (filters) => {
  const intersectedSubjects = new Map()
  const [filterListA, ...rest] = Object.values(filters).map((filter) => {
    const filterMap = new Map()
    filter.forEach((subjectData) => {
      filterMap.set(subjectData.subject, { ...subjectData })
    })

    return filterMap
  })
  filterListA.forEach((subjectData) => {
    const { subject, collection, filter } = subjectData
    intersectedSubjects.set(subject, [{ collection, filter }])

    rest.forEach((filterList) => {
      const existingSubjectData = intersectedSubjects.get(subject)
      const filterSubjectData = filterList.get(subject)

      if (!!existingSubjectData && !!filterSubjectData) {
        intersectedSubjects.set(
          subjectData.subject,
          existingSubjectData.concat([
            {
              collection: filterSubjectData.collection,
              filter: filterSubjectData.filter,
            },
          ])
        )
      } else {
        intersectedSubjects.delete(subject)
      }
    })
  })

  return intersectedSubjects
}

export const sortTableRowDataBySite = (dataBySite) => {
  return dataBySite
    .map((site) => {
      const { count, targetTotal } = site.totalsForStudy
      site.counts[TOTAL_LABEL] = count
      site.targets[TOTAL_LABEL] = targetTotal
      return site
    })
    .sort(sortSitesByNameAndTotalsAtBottom)
}

const sortSitesByNameAndTotalsAtBottom = (siteA, siteB) => {
  if (siteA.name === TOTALS_STUDY) return 1
  if (siteB.name === TOTALS_STUDY) return -1
  if (siteA.name < siteB.name) return -1
  if (siteA.name > siteB.name) return 1

  return 0
}

const formatGraphTableCellData = (siteTarget, studyCounts = 0) => {
  if (!siteTarget) return `${studyCounts}`

  const percent = studyCountsToPercentage(studyCounts, siteTarget)

  return `${studyCounts} / ${siteTarget} (${formatAsPercentage(percent)})`
}

export const graphTableColumns = (columns) => [
  { name: SITE, color: 'gray' },
  ...columns
    .filter((column) => column.name !== N_A)
    .concat({ name: TOTAL_LABEL, color: 'gray' }),
]

const formatAsPercentage = (value = 0) => value.toFixed(0) + '%'

export const graphTableRowData = (sortedGraphTableData, tableHeaders) => {
  return sortedGraphTableData.map((siteData) => {
    return tableHeaders.map(({ name: columnHeader, color }) => {
      const {
        name,
        counts: { [columnHeader]: siteCount },
        targets: { [columnHeader]: siteTarget },
      } = siteData

      return columnHeader === SITE
        ? { data: name, color }
        : { data: formatGraphTableCellData(siteTarget, siteCount), color }
    })
  })
}
