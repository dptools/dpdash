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

export const createLabels = (overrides = []) => [
  {
    name: 'Pending evaluation',
    color: '#b1b1b1',
  },
  {
    name: 'Excellent',
    color: '#7AAA7B',
  },
  {
    name: 'Good',
    color: '#97C0CE',
  },
  {
    name: 'Average',
    color: '#FFD700',
  },
  {
    name: 'Poor',
    color: '#F89235',
  },
  ...overrides,
]

export const createDataBySite = (overrides = []) => [
  {
    name: 'Totals',
    counts: {
      'Pending evaluation': 60,
      Good: 40,
      Average: 26,
      Excellent: 87,
      Poor: 2,
      'N/A': 0,
      Total: 215,
    },
    totalsForStudy: {
      count: 215,
    },
    percentages: {
      'Pending evaluation': 27.906976744186046,
      Good: 18.6046511627907,
      Average: 12.093023255813954,
      Excellent: 40.46511627906977,
      Poor: 0.9302325581395349,
      'N/A': 0,
    },
    targets: {
      'Pending evaluation': 215,
      Excellent: 215,
      Good: 215,
      Average: 215,
      Poor: 215,
    },
  },
  {
    name: 'Birmingham',
    counts: {
      'Pending evaluation': 2,
      Excellent: 0,
      Good: 0,
      Average: 0,
      Poor: 0,
      'N/A': 0,
      Total: 2,
    },
    totalsForStudy: {
      count: 2,
    },
    percentages: {
      'Pending evaluation': 100,
      Excellent: 0,
      Good: 0,
      Average: 0,
      Poor: 0,
      'N/A': 0,
    },
    targets: {
      'Pending evaluation': 0,
      Excellent: 0,
      Good: 0,
      Average: 0,
      Poor: 0,
    },
  },
  {
    name: 'Calgary',
    counts: {
      'Pending evaluation': 3,
      Excellent: 2,
      Good: 0,
      Average: 1,
      Poor: 0,
      'N/A': 0,
      Total: 6,
    },
    totalsForStudy: {
      count: 6,
    },
    percentages: {
      'Pending evaluation': 50,
      Excellent: 33.33333333333333,
      Good: 0,
      Average: 16.666666666666664,
      Poor: 0,
      'N/A': 0,
    },
    targets: {
      'Pending evaluation': 0,
      Excellent: 0,
      Good: 0,
      Average: 0,
      Poor: 0,
    },
  },
  {
    name: 'Cambridge UK',
    counts: {
      'Pending evaluation': 1,
      Excellent: 0,
      Good: 1,
      Average: 0,
      Poor: 0,
      'N/A': 0,
      Total: 2,
    },
    totalsForStudy: {
      count: 2,
    },
    percentages: {
      'Pending evaluation': 50,
      Excellent: 0,
      Good: 50,
      Average: 0,
      Poor: 0,
      'N/A': 0,
    },
    targets: {
      'Pending evaluation': 0,
      Excellent: 0,
      Good: 0,
      Average: 0,
      Poor: 0,
    },
  },
  ...overrides,
]

export const createTableHeaders = (overrides = []) => [
  {
    color: 'gray',
    name: 'Site',
  },
  {
    color: '#b1b1b1',
    name: 'Pending evaluation',
  },
  {
    color: '#7AAA7B',
    name: 'Excellent',
  },
  {
    color: '#97C0CE',
    name: 'Good',
  },
  {
    color: '#FFD700',
    name: 'Average',
  },
  {
    color: '#F89235',
    name: 'Poor',
  },
  {
    color: 'gray',
    name: 'Total',
  },
  ...overrides,
]

export const createGraphTableRows = (overrides = []) => [
  [
    {
      color: 'gray',
      data: 'Totals',
    },
    {
      data: '60 / 215 (28%)',
      color: '#b1b1b1',
    },
    {
      data: '87 / 215 (40%)',
      color: '#7AAA7B',
    },
    {
      data: '40 / 215 (19%)',
      color: '#97C0CE',
    },
    {
      data: '26 / 215 (12%)',
      color: '#FFD700',
    },
    {
      data: '2 / 215 (1%)',
      color: '#F89235',
    },
    {
      data: '215',
      color: 'gray',
    },
  ],
  [
    {
      color: 'gray',
      data: 'Birmingham',
    },
    {
      data: '2',
      color: '#b1b1b1',
    },
    {
      data: '0',
      color: '#7AAA7B',
    },
    {
      data: '0',
      color: '#97C0CE',
    },
    {
      data: '0',
      color: '#FFD700',
    },
    {
      data: '0',
      color: '#F89235',
    },
    {
      data: '2',
      color: 'gray',
    },
  ],
  [
    {
      color: 'gray',
      data: 'Calgary',
    },
    {
      data: '3',
      color: '#b1b1b1',
    },
    {
      data: '2',
      color: '#7AAA7B',
    },
    {
      data: '0',
      color: '#97C0CE',
    },
    {
      data: '1',
      color: '#FFD700',
    },
    {
      data: '0',
      color: '#F89235',
    },
    {
      data: '6',
      color: 'gray',
    },
  ],
  [
    {
      color: 'gray',
      data: 'Cambridge UK',
    },
    {
      data: '1',
      color: '#b1b1b1',
    },
    {
      data: '0',
      color: '#7AAA7B',
    },
    {
      data: '1',
      color: '#97C0CE',
    },
    {
      data: '0',
      color: '#FFD700',
    },
    {
      data: '0',
      color: '#F89235',
    },
    {
      data: '2',
      color: 'gray',
    },
  ],
  ...overrides,
]
