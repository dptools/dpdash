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
  deleteOne: jest.fn(),
  insertOne: jest.fn(),
  find: jest.fn(function () {
    return this
  }),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
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
