import { ObjectId } from 'mongodb'
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
  distinct: jest.fn(),
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

export const createFilters = (overrides = {}) => ({
  chrcrit_part: [
    { name: 'HC', value: 'true' },
    { name: 'CHR', value: 'true' },
    { name: 'Missing', value: 'true' }
  ],
  included_excluded: [
    { name: 'Included', value: 'true' },
    { name: 'Excluded', value: 'true' },
    { name: 'Missing', value: 'true' }
  ],
  sex_at_birth: [
    { name: 'Male', value: 'true' },
    { name: 'Female', value: 'true' },
    { name: 'Missing', value: 'true' }
  ],
  ...overrides,
})

export const createSubjectAssessment = (overrides = {}) => ({
    "_id": new ObjectId(),
    "day": 1,
    "reftime": "",
    "timeofday": "",
    "weekday": "",
    "subject_id": "CA00007",
    "site": "CA",
    "mtime": "2022-05-06",
    "surveys_processed_GENERAL": "",
    "surveys_raw_PROTECTED": 1,
    "cnb_processed_GENERAL": "",
    "cnb_raw_PROTECTED": 1,
    "cnb_ss_processed_GENERAL": "",
    "cnb_ss_raw_PROTECTED": 1,
    "eeg_processed_GENERAL": "",
    "eeg_raw_PROTECTED": 1,
    "eeg_ss_processed_GENERAL": "",
    "eeg_ss_raw_PROTECTED": 1,
    "actigraphy_processed_GENERAL": "",
    "actigraphy_raw_PROTECTED": 1,
    "actigraphy_ss_processed_GENERAL": "",
    "actigraphy_ss_raw_PROTECTED": 1,
    "mri_processed_GENERAL": "",
    "mri_raw_PROTECTED": "",
    "mri_ss_processed_GENERAL": "",
    "mri_ss_raw_PROTECTED": "",
    "interview_audio_processed_GENERAL": 1,
    "interview_audio_raw_PROTECTED": "",
    "interview_video_processed_GENERAL": 1,
    "interview_video_raw_PROTECTED": "",
    "interview_transcript_processed_GENERAL": "",
    "interview_transcript_raw_PROTECTED": "",
    "interview_ss_processed_GENERAL": "",
    "interview_ss_raw_PROTECTED": "",
    "mind_phone_processed_GENERAL": "",
    "mind_phone_raw_PROTECTED": "",
    "mind_sensor_processed_GENERAL": "",
    "mind_sensor_raw_PROTECTED": "",
    "mind_ss_processed_GENERAL": "",
    "mind_ss_raw_PROTECTED": "",
    "surveys_processed_PROTECTED": "",
    "cnb_processed_PROTECTED": "",
    "cnb_ss_processed_PROTECTED": "",
    "eeg_processed_PROTECTED": "",
    "eeg_ss_processed_PROTECTED": "",
    "actigraphy_processed_PROTECTED": "",
    "actigraphy_ss_processed_PROTECTED": "",
    "mri_processed_PROTECTED": "",
    "mri_ss_processed_PROTECTED": "",
    "interview_audio_processed_PROTECTED": "",
    "interview_video_processed_PROTECTED": "",
    "interview_transcript_processed_PROTECTED": "",
    "interview_ss_processed_PROTECTED": "",
    "mind_phone_processed_PROTECTED": "",
    "mind_sensor_processed_PROTECTED": "",
    "mind_ss_processed_PROTECTED": "",
    "path": "/Users/ivanrts/Downloads/test_data/files-ProNET-flowcheck-day1to9999.csv",
    ...overrides,
  })

export const createToc = (overrides = {}) => ({
    "_id": new ObjectId(),
    "study": "CA",
    "subject": "CA00007",
    "assessment": "flowcheck",
    "units": "day",
    "start": "1",
    "end": "1",
    "extension": ".csv",
    "glob": "/Users/ivanrts/Downloads/test_data/CA-CA00007-flowcheck-day*.csv",
    "collection": "bc9008bc6383ddc371a01dec9098a80c5633a8716b70537cdbd1c1282c290448",
    "time_units": "day",
    "time_start": 1,
    "time_end": 1,
    "path": "/Users/ivanrts/Downloads/test_data/CA-CA00007-flowcheck-day1to1.csv",
    "filetype": "text/csv",
    "encoding": null,
    "basename": "CA-CA00007-flowcheck-day1to1.csv",
    "dirname": "/Users/ivanrts/Downloads/test_data",
    "dirty": false,
    "synced": true,
    "mtime": 1654738581,
    "size": 958,
    "uid": 501,
    "gid": 20,
    "mode": 33252,
    "role": "data",
    "updated": new Date("2022-06-24T15:15:46.542Z"),
    ...overrides,
  })
