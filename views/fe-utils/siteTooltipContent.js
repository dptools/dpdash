import { N_A, TOTAL_LABEL } from '../../constants'
import { studyCountsToPercentage, formatSiteData } from './helpers'

export const siteTooltipContent = (siteData, siteTotals) => {
  const { count, targetTotal } = siteTotals
  const tooltipData = []
  const siteTotalPercent = studyCountsToPercentage(count, targetTotal)

  siteData
    .filter(({ name }) => name !== N_A)
    .forEach(({ name: valueName, payload }) => {
      if (valueName !== N_A) {
        const {
          counts: { [valueName]: siteCount },
          targets: { [valueName]: siteTarget },
          percentages: { [valueName]: sitePercentage },
        } = payload
        const valueColumn = formatSiteData(
          siteCount,
          siteTarget,
          sitePercentage
        )
        const rowValue = { labelColumn: valueName, valueColumn }
        tooltipData.push(rowValue)
      }
    })

  tooltipData.push({
    labelColumn: TOTAL_LABEL,
    valueColumn: formatSiteData(count, targetTotal, siteTotalPercent),
  })

  return tooltipData
}
