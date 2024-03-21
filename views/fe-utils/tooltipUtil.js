export const toolTipPercent = (count, targetTotal) => {
  if (!targetTotal || Number.isNaN(+count) || Number.isNaN(+targetTotal)) {
    return 0
  }

  return ((+count / +targetTotal) * 100).toFixed(0)
}
