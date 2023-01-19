import { SITE_NAMES } from '../../utils/siteNames'
import {
  N_A,
  TOTALS_STUDY,
  FILTER_TO_MONGO_VALUE_MAP,
  TRUE_STRING,
} from '../../constants'

export const isAnyTargetIncluded = (studyTotals) => {
  return Object.keys(studyTotals)
    .filter((site) => site !== TOTALS_STUDY)
    .some((site) => studyTotals[site]?.targetTotal !== undefined)
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
}) => {
  if (shouldCountSubject) {
    const existingData = dataMap.get(dataKey)
    const existingTotalsData = dataMap.get(totalsDataKey)

    if (existingData) {
      dataMap.set(dataKey, existingData + 1)
    } else {
      dataMap.set(dataKey, 1)
    }

    if (existingTotalsData) {
      dataMap.set(totalsDataKey, existingTotalsData + 1)
    } else {
      dataMap.set(totalsDataKey, 1)
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
}) => {
  if (shouldCountSubject) {
    if (studyTotals[siteName]) {
      studyTotals[siteName].count += 1
    } else {
      studyTotals[siteName] = {
        count: 1,
        targetValue,
      }
    }
    studyTotals[TOTALS_STUDY].count += 1
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

export const mongoQueryFromFilters = (filters) => {
  if (!filters) {
    return
  }
  const activeFilters = []
  const facet = {}
  const chrCritFilters = filters.chrcrit_part
    .filter((f) => f.value === TRUE_STRING)
    .map((filter) => FILTER_TO_MONGO_VALUE_MAP[filter.name])
  const includedExcludedFilters = filters.included_excluded
    .filter((f) => f.value === TRUE_STRING)
    .map((filter) => FILTER_TO_MONGO_VALUE_MAP[filter.name])

  if (!!chrCritFilters.length) {
    facet.chrcrit_part = []
    facet.chrcrit_part.push({
      $match: { chrcrit_part: { $in: chrCritFilters } },
    })
    activeFilters.push('chrcrit_part')
  }

  if (!!includedExcludedFilters.length) {
    facet.included_excluded = []
    facet.included_excluded.push({
      $match: { included_excluded: { $in: includedExcludedFilters } },
    })
    activeFilters.push('included_excluded')
  }

  return {
    mongoAggregateQueryForFilters: [
      {
        $facet: facet,
      },
    ],
    activeFilters,
  }
}
