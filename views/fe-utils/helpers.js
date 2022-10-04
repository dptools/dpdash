import { N_A } from '../../constants'

export const formatAsPercentage = (value = 0) => value.toFixed(0) + '%'

export const formatTooltipTargets = (target) => target || N_A

export const studyCountsToPercentage = (studyCount, targetTotal) => {
  if (!targetTotal || Number.isNaN(+studyCount) || Number.isNaN(+targetTotal)) {
    return 0
  }

  return (+studyCount / +targetTotal) * 100
}

export const formatSiteData = (studyCounts, studyTargets, studyPercentage) =>
  `${studyCounts} / ${formatTooltipTargets(studyTargets)} (${formatAsPercentage(
    studyPercentage
  )})`
