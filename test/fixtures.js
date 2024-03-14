import { N_A } from '../server/constants'

export const createFieldLabelValue = (overrides = {}) => ({
  value: '',
  label: '',
  color: '#e2860a',
  targetValues: {},
  ...overrides,
})

let chartID = 0

export const createChart = (overrides = {}, fieldLabelOverrides = []) => ({
  _id: (chartID++).toString(),
  assessment: '',
  description: '',
  fieldLabelValueMap: [
    createFieldLabelValue({
      value: 'foo',
      label: 'Foo',
      targetValues: {
        LA: '3',
        YA: '3',
        MA: '3',
      },
    }),
    ...fieldLabelOverrides,
  ],
  owner: '',
  title: '',
  variable: '',
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
  drop: jest.fn(),
  insertOne: jest.fn(),
  insertMany: jest.fn(),
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
  stream: jest.fn(),
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

export const createUser = (overrides = {}) => ({
  uid: 'user-uid',
  display_name: 'Display Name',
  icon: 'icon',
  ...overrides,
})

export const createRequestWithUser = (overrides = {}, userOverrides = {}) => ({
  ...createRequest(overrides),
  user: createUser({ ...userOverrides }),
  session: {
    icon: 'icon',
    display_name: 'Display Name',
    role: '',
    destroy: jest.fn(),
  },
})

export const createSubject = (overrides = {}) => ({
  collection: 'collection',
  study: 'study',
  subject: 'subject',
  ...overrides,
})

export const createParticipantDayData = (overrides = {}) => ({
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
  Active: 1,
  Consent: '',
  participant: '',
  synced: '',
  study: '',
  daysInStudy: 0,
  ...overrides,
})

export const createParticipantRow = (overrides = {}) => ({
  participant: 'CA00066',
  days: 1,
  study: 'CA',
  star: true,
  complete: true,
  ...overrides,
})

export const createParticipantList = (length = 10, overrides = {}) =>
  Array(length).fill(createParticipantRow(overrides))

export const createFilters = (overrides = {}) => ({
  chrcrit_part: [
    { name: 'HC', value: 'true' },
    { name: 'CHR', value: 'true' },
    { name: 'Missing', value: 'true' },
  ],
  included_excluded: [
    { name: 'Included', value: 'true' },
    { name: 'Excluded', value: 'true' },
    { name: 'Missing', value: 'true' },
  ],
  sex_at_birth: [
    { name: 'Male', value: 'true' },
    { name: 'Female', value: 'true' },
    { name: 'Missing', value: 'true' },
  ],
  ...overrides,
})

export const createNewAssessmentDayData = (overrides = {}) => ({
  metadata: {},
  participant_assessments: [],
  ...overrides,
})

export const createSiteMetadata = (overrides = {}) => ({
  metadata: {},
  participants: [],
  ...overrides,
})

export const createAssessmentDayData = (overrides = {}) => ({
  day: 1,
  assessment: '',
  participant: '',
  study: '',
  dayData: [],
  daysInStudy: overrides.dayData ? Math.max(...overrides.dayData.map(dayData => dayData.day)) : 0,
  ...overrides,
})
