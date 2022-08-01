export const legend = (fieldLabelValueMap) =>
  fieldLabelValueMap.map(({ label, color }) => ({
    name: label,
    symbol: {
      type: 'square',
      fill: color,
    },
  }))
