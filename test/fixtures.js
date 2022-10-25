export const createFieldLabelValue = (overrides = {}) => ({
  value: '1',
  label: 'THE VALUE',
  color: '#e2860a',
  targetValues: { CA: '50', ProNET: '60', LA: '30', YA: '20', MA: '21' },
  ...overrides,
})

export const createChart = (overrides = {}) => ({
  _id: 'chart-id',
  title: 'chart title',
  variable: 'surveys_raw_PROTECTED',
  assessment: 'flowcheck',
  description: 'chart description',
  fieldLabelValueMap: [createFieldLabelValue()],
  ...overrides,
})
