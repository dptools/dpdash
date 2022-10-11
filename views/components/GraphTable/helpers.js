import { TOTAL_LABEL, TOTALS, N_A } from '../../../constants'
import {
  studyCountsToPercentage,
  formatAsPercentage,
} from '../../fe-utils/helpers'

export const graphTableRowDataBySite = (dataBySite) => {
  return dataBySite
    .map((site) => {
      const { count, targetTotal } = site.totalsForStudy
      site.counts[TOTAL_LABEL] = count
      site.targets[TOTAL_LABEL] = targetTotal
      site.percentages[TOTAL_LABEL] = studyCountsToPercentage(
        count,
        targetTotal
      )
      return site
    })
    .sort(sortAllSitesBeforeTotalsSite)
}

const sortAllSitesBeforeTotalsSite = (siteA, siteB) => {
  if (siteA.name === TOTALS) return -1
  if (siteB.name === TOTALS) return -1
}

export const formatSiteData = (studyCounts, studyTargets, studyPercentage) =>
  !!studyTargets
    ? `${studyCounts} / ${studyTargets} (${formatAsPercentage(
        studyPercentage
      )})`
    : `${studyCounts} / (${formatAsPercentage(studyPercentage)})`

export const graphTableColumns = (columns) =>
  columns.filter((column) => column.name !== N_A).concat({ name: TOTAL_LABEL })
