import { N_A } from '../server/constants'

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
  owner: 'user',
  ...overrides,
})

export const createLabel = (overrides = {}) => ({
  name: 'label-name',
  color: 'label-color',
  ...overrides,
})

export const createSiteData = (overrides = {}) => ({
  name: 'Site name',
  counts: {
    Good: 1,
    Bad: 1,
    [N_A]: 0,
    Total: 2,
  },
  totalsForStudy: {
    count: 2,
  },
  percentages: {
    Good: 50,
    Bad: 50,
    [N_A]: 0,
  },
  targets: {
    Good: 0,
    Bad: 0,
  },
  ...overrides,
})

export const createDb = (overrides = {}) => ({
  aggregate: jest.fn(function () {
    return this
  }),
  collection: jest.fn(function () {
    return this
  }),
  distinct: jest.fn(),
  deleteOne: jest.fn(),
  insertOne: jest.fn(),
  find: jest.fn(function () {
    return this
  }),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  limit: jest.fn(function () {
    return this
  }),
  sort: jest.fn(function () {
    return this
  }),
  toArray: jest.fn(),
  updateOne: jest.fn(),
  ...overrides,
})

export const createResponse = (overrides = {}) => ({
  clearCookie: jest.fn(),
  header: jest.fn(),
  json: jest.fn(),
  redirect: jest.fn(),
  send: jest.fn(),
  status: jest.fn(function () {
    return this
  }),
  ...overrides,
})

export const createRequest = (overrides = {}) => ({
  headers: {},
  params: {},
  query: '',
  body: {},
  app: {
    locals: {
      appDb: createDb(),
      dataDb: createDb(),
    },
  },
  logout: jest.fn(),
  ...overrides,
})

export const createRequestWithUser = (overrides = {}) => ({
  ...createRequest(overrides),
  user: 'user-id',
  session: {
    icon: 'icon',
    display_name: 'Display Name',
    role: '',
    userAccess: [],
    destroy: jest.fn(),
  },
  ...overrides,
})

export const createSubject = (overrides = {}) => ({
  collection: 'collection',
  study: 'study',
  subject: 'subject',
  ...overrides,
})

export const createUser = (overrides = {}) => ({
  uid: 'user-uid',
  display_name: 'Display Name',
  icon: 'icon',
  ...overrides,
})

export const createSubjectDayData = (overrides = {}) => ({
  ...overrides,
})

export const createConfiguration = (overrides = {}) => ({
  _id: '1',
  owner: 'owl',
  config: {},
  type: 'matrix',
  created: 'Mon, 12 June 2023',
  readers: [],
  ...overrides,
})

export const createColorbrewer = (overrides = {}) => ({
  schemeGroups: {
    sequential: [
      'BuGn',
      'BuPu',
      'GnBu',
      'OrRd',
      'PuBu',
      'PuBuGn',
      'PuRd',
      'RdPu',
      'YlGn',
      'YlGnBu',
      'YlOrBr',
      'YlOrRd',
    ],
    singlehue: ['Blues', 'Greens', 'Greys', 'Oranges', 'Purples', 'Reds'],
    diverging: [
      'BrBG',
      'PiYG',
      'PRGn',
      'PuOr',
      'RdBu',
      'RdGy',
      'RdYlBu',
      'RdYlGn',
      'Spectral',
    ],
    qualitative: [
      'Accent',
      'Dark2',
      'Paired',
      'Pastel1',
      'Pastel2',
      'Set1',
      'Set2',
      'Set3',
    ],
  },
  YlGn: {
    3: ['#f7fcb9', '#addd8e', '#31a354'],
    4: ['#ffffcc', '#c2e699', '#78c679', '#238443'],
    5: ['#ffffcc', '#c2e699', '#78c679', '#31a354', '#006837'],
    6: ['#ffffcc', '#d9f0a3', '#addd8e', '#78c679', '#31a354', '#006837'],
  },
  ...overrides,
})

export const createColorList = (overrides = []) => [
  { value: 0, label: ['#f7fcb9', '#addd8e', '#31a354'] },
  { value: 1, label: ['#ffffcc', '#c2e699', '#78c679', '#238443'] },
  {
    value: 2,
    label: ['#ffffcc', '#c2e699', '#78c679', '#31a354', '#006837'],
  },
  {
    label: ['#ffffcc', '#d9f0a3', '#addd8e', '#78c679', '#31a354', '#006837'],
    value: 3,
  },
  ...overrides,
]

export const createAnalysisConfig = (overrides = {}) => ({
  label: '',
  analysis: '',
  color: [],
  range: [],
  variable: '',
  category: '',
  ...overrides,
})

export const createMatrixData = (overrides = {}) => ({
  analysis: '',
  category: '',
  color: [],
  data: [],
  label: '',
  range: [],
  stat: [],
  variable: '',
  ...overrides,
})

export const createAssessmentsFromConfig = (overrides = {}) => ({
  assessment: '',
  collection: '',
  ...overrides,
})

export const createMetadataParticipant = (overrides = {}) => ({
  subject: '',
  synced: '',
  days: 1,
  study: '',
  lastSyncedColor: '',
  ...overrides,
})
