import { TOTAL_LABEL, TOTALS } from '../../../constants'
import { studyCountsToPercentage } from '../../fe-utils/helpers'

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
