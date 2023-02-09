import { N_A, TOTAL_LABEL, TOTALS } from '../../../constants'

export const formatTooltipData = (studyCounts = 0, studyTargets) =>
  !!studyTargets ? `${studyCounts} / ${studyTargets}` : `${studyCounts}`

export const formatTotalsTooltipData = ({
  siteCount,
  siteTarget,
  shouldDisplayTargets,
}) => (shouldDisplayTargets ? `${siteCount} / ${siteTarget}` : `${siteCount}`)

export const isTargetShown = (chartPayload) =>
  chartPayload.some(
    ({ name: siteName, payload: sitePayload }) =>
      !!sitePayload.targets[siteName]
  )

export const siteTooltipContent = (siteData, siteTotals) => {
  const { count, targetTotal } = siteTotals
  const tooltipData = []

  siteData
    .filter(({ name }) => name !== N_A)
    .forEach(({ name: valueName, payload }) => {
      if (valueName !== N_A) {
        const {
          counts: { [valueName]: siteCount },
          targets: { [valueName]: siteTarget },
        } = payload

        if (payload.name === TOTALS) {
          const valueColumn = formatTotalsTooltipData({
            siteCount,
            siteTarget,
            shouldDisplayTargets: !!targetTotal,
          })
          const rowValue = { labelColumn: valueName, valueColumn }

          tooltipData.push(rowValue)
        } else {
          const valueColumn = formatTooltipData(siteCount, siteTarget)
          const rowValue = { labelColumn: valueName, valueColumn }

          tooltipData.push(rowValue)
        }
      }
    })

  tooltipData.push({
    labelColumn: TOTAL_LABEL,
    valueColumn: formatTooltipData(count, targetTotal),
  })

  return tooltipData
}
