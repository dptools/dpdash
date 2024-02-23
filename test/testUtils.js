import { createAssessmentDayData } from './fixtures'
import {
  INCLUSION_EXCLUSION_CRITERIA_FORM,
  SOCIODEMOGRAPHICS_FORM,
} from '../server/constants'

export const dayDataAssessments = [
  createAssessmentDayData({
    assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
    participant: 'YA1',
    study: 'YA',
    dayData: [{ chrcrit_part: 1, day: 4 }],
  }),
  createAssessmentDayData({
    assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
    participant: 'YA1',
    study: 'YA',
    dayData: [{ included_excluded: 1, day: 4 }],
  }),
  createAssessmentDayData({
    assessment: SOCIODEMOGRAPHICS_FORM,
    participant: 'YA1',
    study: 'YA',
    dayData: [{ chrdemo_sexassigned: 2, day: 4 }],
  }),
  createAssessmentDayData({
    assessment: 'eeg',
    participant: 'YA1',
    study: 'YA',
    dayData: [{ eeg: 'foo', var: 'var', baz: 'baz' }],
  }),
  createAssessmentDayData({
    assessment: 'eeg',
    participant: 'YA2',
    study: 'YA',
    dayData: [{ day: 5, eeg: 'bar', var: 'var', baz: 'baz' }],
  }),
  createAssessmentDayData({
    assessment: 'eeg',
    participant: 'YA3',
    study: 'YA',
    dayData: [{ day: 2, eeg: 'bar', var: 'var', baz: 'baz' }],
  }),
  createAssessmentDayData({
    assessment: 'eeg',
    participant: 'YA4',
    study: 'YA',
    dayData: [
      { day: 5, eeg: null, var: 'var', baz: 'baz' },
      { eeg: 'foo', var: 'var', baz: 'baz' },
    ],
  }),
  createAssessmentDayData({
    assessment: 'eeg',
    participant: 'MA1',
    study: 'MA',
    dayData: [{ eeg: 'foo', var: 'var', baz: 'baz' }],
  }),
  createAssessmentDayData({
    assessment: 'eeg',
    participant: 'MA2',
    study: 'MA',
    dayData: [{ day: 5, eeg: 'foo', var: 'var', baz: 'baz' }],
  }),
  createAssessmentDayData({
    assessment: 'eeg',
    participant: 'MA3',
    study: 'MA',
    dayData: [{ day: 2, eeg: 'foo', var: 'var', baz: 'baz' }],
  }),
  createAssessmentDayData({
    assessment: 'eeg',
    participant: 'MA4',
    study: 'MA',
    dayData: [
      { day: 5, eeg: null, var: 'var', baz: 'baz' },
      { eeg: 'foo', var: 'var', baz: 'baz' },
    ],
  }),
  createAssessmentDayData({
    assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
    participant: 'MA3',
    study: 'MA',
    dayData: [{ included_excluded: 1, day: 4 }],
  }),
  createAssessmentDayData({
    assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
    participant: 'MA3',
    study: 'MA',
    dayData: [{ chrcrit_part: 1, day: 4 }],
  }),

  createAssessmentDayData({
    assessment: SOCIODEMOGRAPHICS_FORM,
    participant: 'MA3',
    study: 'MA',
    dayData: [{ chrdemo_sexassigned: 1, day: 4 }],
  }),
  createAssessmentDayData({
    assessment: 'eeg',
    participant: 'LA1',
    study: 'LA',
    dayData: [{ eeg: 'foo', var: 'var', baz: 'baz' }],
  }),
  createAssessmentDayData({
    assessment: 'eeg',
    participant: 'LA2',
    study: 'LA',
    dayData: [{ day: 5, eeg: 'foo', var: 'var', baz: 'baz' }],
  }),
  createAssessmentDayData({
    assessment: 'eeg',
    participant: 'LA3',
    study: 'LA',
    dayData: [{ day: 2, eeg: 'foo', var: 'var', baz: 'baz' }],
  }),
  createAssessmentDayData({
    assessment: 'eeg',
    participant: 'LA4',
    study: 'LA',
    dayData: [
      { day: 5, eeg: null, var: 'var', baz: 'baz' },
      { eeg: 'foo', var: 'var', baz: 'baz' },
    ],
  }),
]

export const chartsDataSuccessResponse = (overrides = {}) => ({
  chartOwner: {
    display_name: 'Display Name',
    icon: 'icon',
    uid: 'owl',
  },
  chart_id: '',
  dataBySite: [
    {
      counts: {
        Bar: 2,
        Foo: 2,
        'N/A': 0,
        Total: 4,
      },
      name: 'Yale',
      percentages: {
        Bar: 50,
        Foo: 50,
        'N/A': 0,
      },
      targets: {
        Bar: 1,
        Foo: 3,
        Total: 4,
      },
      totalsForStudy: {
        count: 4,
        targetTotal: 4,
      },
    },
    {
      counts: {
        Bar: 2,
        Foo: 10,
        'N/A': 2,
        Total: 12,
      },
      name: 'Totals',
      percentages: {
        Bar: 14.285714285714285,
        Foo: 71.42857142857143,
        'N/A': 14.285714285714285,
      },
      targets: {
        Bar: 5,
        Foo: 9,
        Total: 14,
      },
      totalsForStudy: {
        count: 12,
        targetTotal: 14,
      },
    },
    {
      counts: {
        Bar: 0,
        Foo: 4,
        'N/A': 1,
        Total: 4,
      },
      name: 'Madrid',
      percentages: {
        Bar: 0,
        Foo: 80,
        'N/A': 20,
      },
      targets: {
        Bar: 2,
        Foo: 3,
        Total: 5,
      },
      totalsForStudy: {
        count: 4,
        targetTotal: 5,
      },
    },
    {
      counts: {
        Bar: 0,
        Foo: 4,
        'N/A': 1,
        Total: 4,
      },
      name: 'UCLA',
      percentages: {
        Bar: 0,
        Foo: 80,
        'N/A': 20,
      },
      targets: {
        Bar: 2,
        Foo: 3,
        Total: 5,
      },
      totalsForStudy: {
        count: 4,
        targetTotal: 5,
      },
    },
  ],
  description: 'Participant EEG Measurements',
  filters: {
    chrcrit_part: [
      {
        name: 'HC',
        value: 'false',
      },
      {
        name: 'CHR',
        value: 'false',
      },
      {
        name: 'Missing',
        value: 'false',
      },
    ],
    included_excluded: [
      {
        name: 'Included',
        value: 'false',
      },
      {
        name: 'Excluded',
        value: 'false',
      },
      {
        name: 'Missing',
        value: 'false',
      },
    ],
    sex_at_birth: [
      {
        name: 'Male',
        value: 'false',
      },
      {
        name: 'Female',
        value: 'false',
      },
      {
        name: 'Missing',
        value: 'false',
      },
    ],
    sites: ['LA', 'MA', 'YA'],
  },
  graphTable: {
    tableColumns: [
      {
        color: 'gray',
        name: 'Site',
      },
      {
        color: '#e2860a',
        name: 'Foo',
      },
      {
        color: 'red',
        name: 'Bar',
      },
      {
        color: 'gray',
        name: 'Total',
      },
    ],
    tableRows: [
      [
        {
          color: 'gray',
          data: 'Madrid',
        },
        {
          color: '#e2860a',
          data: '4 / 3 (133%)',
        },
        {
          color: 'red',
          data: '0 / 2 (0%)',
        },
        {
          color: 'gray',
          data: '4 / 5 (80%)',
        },
      ],
      [
        {
          color: 'gray',
          data: 'UCLA',
        },
        {
          color: '#e2860a',
          data: '4 / 3 (133%)',
        },
        {
          color: 'red',
          data: '0 / 2 (0%)',
        },
        {
          color: 'gray',
          data: '4 / 5 (80%)',
        },
      ],
      [
        {
          color: 'gray',
          data: 'Yale',
        },
        {
          color: '#e2860a',
          data: '2 / 3 (67%)',
        },
        {
          color: 'red',
          data: '2 / 1 (200%)',
        },
        {
          color: 'gray',
          data: '4 / 4 (100%)',
        },
      ],
      [
        {
          color: 'gray',
          data: 'Totals',
        },
        {
          color: '#e2860a',
          data: '10 / 9 (111%)',
        },
        {
          color: 'red',
          data: '2 / 5 (40%)',
        },
        {
          color: 'gray',
          data: '12 / 14 (86%)',
        },
      ],
    ],
  },
  labels: [
    {
      color: '#e2860a',
      name: 'Foo',
    },
    {
      color: 'red',
      name: 'Bar',
    },
    {
      color: '#808080',
      name: 'N/A',
    },
  ],
  legend: [
    {
      name: 'Foo',
      symbol: {
        fill: '#e2860a',
        type: 'square',
      },
    },
    {
      name: 'Bar',
      symbol: {
        fill: 'red',
        type: 'square',
      },
    },
  ],
  studyTotals: {
    Madrid: {
      count: 4,
      targetTotal: 5,
    },
    Totals: {
      count: 12,
      targetTotal: 14,
    },
    UCLA: {
      count: 4,
      targetTotal: 5,
    },
    Yale: {
      count: 4,
      targetTotal: 4,
    },
  },
  title: 'Eeg Measurements',
  userSites: ['LA', 'MA', 'YA'],
  ...overrides,
})

export const chartsDataInitialResponse = (overrides = {}) => ({
  chartOwner: {
    display_name: 'Display Name',
    icon: 'icon',
    uid: 'owl',
  },
  chart_id: '',
  dataBySite: [
    {
      counts: {
        Bar: 0,
        Foo: 1,
        'N/A': 3,
        Total: 1,
      },
      name: 'Yale',
      percentages: {
        Bar: 0,
        Foo: 25,
        'N/A': 75,
      },
      targets: {
        Bar: 1,
        Foo: 3,
        Total: 4,
      },
      totalsForStudy: {
        count: 1,
        targetTotal: 4,
      },
    },
    {
      counts: {
        Foo: 2,
        'N/A': 12,
        Total: 2,
      },
      name: 'Totals',
      percentages: {
        Foo: 14.285714285714285,
        'N/A': 85.71428571428571,
      },
      targets: {
        Bar: 3,
        Foo: 6,
        Total: 14,
      },
      totalsForStudy: {
        count: 2,
        targetTotal: 14,
      },
    },
    {
      counts: {
        Bar: 0,
        Foo: 1,
        'N/A': 4,
        Total: 1,
      },
      name: 'Madrid',
      percentages: {
        Bar: 0,
        Foo: 20,
        'N/A': 80,
      },
      targets: {
        Bar: 2,
        Foo: 3,
        Total: 5,
      },
      totalsForStudy: {
        count: 1,
        targetTotal: 5,
      },
    },
  ],
  description: 'Participant EEG Measurements',
  filters: {
    chrcrit_part: [
      {
        name: 'HC',
        value: 'true',
      },
      {
        name: 'CHR',
        value: 'true',
      },
      {
        name: 'Missing',
        value: 'true',
      },
    ],
    included_excluded: [
      {
        name: 'Included',
        value: 'true',
      },
      {
        name: 'Excluded',
        value: 'false',
      },
      {
        name: 'Missing',
        value: 'false',
      },
    ],
    sex_at_birth: [
      {
        name: 'Male',
        value: 'true',
      },
      {
        name: 'Female',
        value: 'true',
      },
      {
        name: 'Missing',
        value: 'true',
      },
    ],
    sites: ['LA', 'MA', 'YA'],
  },
  graphTable: {
    tableColumns: [
      {
        color: 'gray',
        name: 'Site',
      },
      {
        color: '#e2860a',
        name: 'Foo',
      },
      {
        color: 'red',
        name: 'Bar',
      },
      {
        color: 'gray',
        name: 'Total',
      },
    ],
    tableRows: [
      [
        {
          color: 'gray',
          data: 'Madrid',
        },
        {
          color: '#e2860a',
          data: '1 / 3 (33%)',
        },
        {
          color: 'red',
          data: '0 / 2 (0%)',
        },
        {
          color: 'gray',
          data: '1 / 5 (20%)',
        },
      ],
      [
        {
          color: 'gray',
          data: 'Yale',
        },
        {
          color: '#e2860a',
          data: '1 / 3 (33%)',
        },
        {
          color: 'red',
          data: '0 / 1 (0%)',
        },
        {
          color: 'gray',
          data: '1 / 4 (25%)',
        },
      ],
      [
        {
          color: 'gray',
          data: 'Totals',
        },
        {
          color: '#e2860a',
          data: '2 / 6 (33%)',
        },
        {
          color: 'red',
          data: '0 / 3 (0%)',
        },
        {
          color: 'gray',
          data: '2 / 14 (14%)',
        },
      ],
    ],
  },
  labels: [
    {
      color: '#e2860a',
      name: 'Foo',
    },
    {
      color: 'red',
      name: 'Bar',
    },
    {
      color: '#808080',
      name: 'N/A',
    },
  ],
  legend: [
    {
      name: 'Foo',
      symbol: {
        fill: '#e2860a',
        type: 'square',
      },
    },
    {
      name: 'Bar',
      symbol: {
        fill: 'red',
        type: 'square',
      },
    },
  ],
  studyTotals: {
    Madrid: {
      count: 1,
      targetTotal: 5,
    },
    Totals: {
      count: 2,
      targetTotal: 14,
    },
    UCLA: {
      count: 0,
      targetTotal: 5,
    },
    Yale: {
      count: 1,
      targetTotal: 4,
    },
  },
  title: 'Eeg Measurements',
  userSites: ['LA', 'MA', 'YA'],
  ...overrides,
})

export const chartsDataFilterResponse = (overrides = {}) => ({
  chartOwner: {
    display_name: 'Display Name',
    icon: 'icon',
    uid: 'owl',
  },
  chart_id: '',
  dataBySite: [
    {
      counts: {
        Bar: 0,
        Foo: 1,
        'N/A': 4,
        Total: 1,
      },
      name: 'Madrid',
      percentages: {
        Bar: 0,
        Foo: 20,
        'N/A': 80,
      },
      targets: {
        Bar: 2,
        Foo: 3,
        Total: 5,
      },
      totalsForStudy: {
        count: 1,
        targetTotal: 5,
      },
    },
    {
      counts: {
        Foo: 1,
        'N/A': 13,
        Total: 1,
      },
      name: 'Totals',
      percentages: {
        Foo: 7.142857142857142,
        'N/A': 92.85714285714286,
      },
      targets: {
        Bar: 2,
        Foo: 3,
        Total: 14,
      },
      totalsForStudy: {
        count: 1,
        targetTotal: 14,
      },
    },
  ],
  description: 'Participant EEG Measurements',
  filters: {
    chrcrit_part: [
      {
        name: 'HC',
        value: 'false',
      },
      {
        name: 'CHR',
        value: 'false',
      },
      {
        name: 'Missing',
        value: 'false',
      },
    ],
    included_excluded: [
      {
        name: 'Included',
        value: 'false',
      },
      {
        name: 'Excluded',
        value: 'false',
      },
      {
        name: 'Missing',
        value: 'false',
      },
    ],
    sex_at_birth: [
      {
        name: 'Male',
        value: 'true',
      },
      {
        name: 'Female',
        value: 'false',
      },
      {
        name: 'Missing',
        value: 'false',
      },
    ],
    sites: ['LA', 'MA', 'YA'],
  },
  graphTable: {
    tableColumns: [
      {
        color: 'gray',
        name: 'Site',
      },
      {
        color: '#e2860a',
        name: 'Foo',
      },
      {
        color: 'red',
        name: 'Bar',
      },
      {
        color: 'gray',
        name: 'Total',
      },
    ],
    tableRows: [
      [
        {
          color: 'gray',
          data: 'Madrid',
        },
        {
          color: '#e2860a',
          data: '1 / 3 (33%)',
        },
        {
          color: 'red',
          data: '0 / 2 (0%)',
        },
        {
          color: 'gray',
          data: '1 / 5 (20%)',
        },
      ],
      [
        {
          color: 'gray',
          data: 'Totals',
        },
        {
          color: '#e2860a',
          data: '1 / 3 (33%)',
        },
        {
          color: 'red',
          data: '0 / 2 (0%)',
        },
        {
          color: 'gray',
          data: '1 / 14 (7%)',
        },
      ],
    ],
  },
  labels: [
    {
      color: '#e2860a',
      name: 'Foo',
    },
    {
      color: 'red',
      name: 'Bar',
    },
    {
      color: '#808080',
      name: 'N/A',
    },
  ],
  legend: [
    {
      name: 'Foo',
      symbol: {
        fill: '#e2860a',
        type: 'square',
      },
    },
    {
      name: 'Bar',
      symbol: {
        fill: 'red',
        type: 'square',
      },
    },
  ],
  studyTotals: {
    Madrid: {
      count: 1,
      targetTotal: 5,
    },
    Totals: {
      count: 1,
      targetTotal: 14,
    },
    UCLA: {
      count: 0,
      targetTotal: 5,
    },
    Yale: {
      count: 0,
      targetTotal: 4,
    },
  },
  title: 'Eeg Measurements',
  userSites: ['LA', 'MA', 'YA'],
  ...overrides,
})
