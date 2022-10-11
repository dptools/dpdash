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
      return site
    })
    .sort(sortAllSitesBeforeTotalsSite)
}

const sortAllSitesBeforeTotalsSite = (siteA, siteB) => {
  if (siteA.name === TOTALS) return -1
  if (siteB.name === TOTALS) return -1
}

export const formatGraphTableCellData = (studyCounts = 0, siteTarget) => {
  if (!siteTarget) return `${studyCounts}`

  const percent = studyCountsToPercentage(studyCounts, siteTarget)

  return `${studyCounts} / ${siteTarget} (${formatAsPercentage(percent)})`
}

export const graphTableColumns = (columns) =>
  columns.filter((column) => column.name !== N_A).concat({ name: TOTAL_LABEL })
