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
      siteCode: 'YA',
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
      siteCode: 'Totals',
      name: 'Totals',
      percentages: {
        Bar: 14,
        Foo: 71,
        'N/A': 14,
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
      siteCode: 'MA',
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
      siteCode: 'LA',
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
    chrcrit_part: {
      HC: {
        label: 'HC',
        value: 0,
      },
      CHR: {
        label: 'CHR',
        value: 0,
      },
      Missing: {
        label: 'Missing',
        value: 0,
      },
    },
    included_excluded: {
      Included: {
        label: 'Included',
        value: 0,
      },
      Excluded: {
        label: 'Excluded',
        value: 0,
      },
      Missing: {
        label: 'Missing',
        value: 0,
      },
    },
    sex_at_birth: {
      Male: {
        label: 'Male',
        value: 0,
      },
      Female: {
        label: 'Female',
        value: 0,
      },
      Missing: {
        label: 'Missing',
        value: 0,
      },
    },
    sites: {
      YA: { label: 'YA', value: 1 },
      LA: { label: 'LA', value: 1 },
      MA: { label: 'MA', value: 1 },
    },
  },
  graphTable: {
    tableColumns: [
      {
        dataProperty: 'site',
        label: 'Network',
        sortable: true,
      },
      {
        dataProperty: 'Foo',
        label: 'Foo',
        sortable: false,
      },
      {
        dataProperty: 'Bar',
        label: 'Bar',
        sortable: false,
      },
      {
        dataProperty: 'Total',
        label: 'Total',
        sortable: false,
      },
    ],
    tableRows: [
      {
        Bar: '0 / 2 (0%)',
        Foo: '4 / 3 (133%)',
        'N/A': '1',
        Total: '4 / 5 (80%)',
        site: 'Madrid',
      },
      {
        Bar: '0 / 2 (0%)',
        Foo: '4 / 3 (133%)',
        'N/A': '1',
        Total: '4 / 5 (80%)',
        site: 'UCLA',
      },
      {
        Bar: '2 / 1 (200%)',
        Foo: '2 / 3 (67%)',
        'N/A': '0',
        Total: '4 / 4 (100%)',
        site: 'Yale',
      },
      {
        Bar: '2 / 5 (40%)',
        Foo: '10 / 9 (111%)',
        'N/A': '2',
        Total: '12 / 14 (86%)',
        site: 'Totals',
      },
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
        type: 'rect',
      },
    },
    {
      name: 'Bar',
      symbol: {
        fill: 'red',
        type: 'rect',
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
  lastModified: '',
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
      siteCode: 'YA',
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
      siteCode: 'Totals',
      name: 'Totals',
      percentages: {
        Foo: 14,
        'N/A': 85,
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
      siteCode: 'MA',
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
    chrcrit_part: {
      HC: {
        label: 'HC',
        value: 1,
      },
      CHR: {
        label: 'CHR',
        value: 1,
      },
      Missing: {
        label: 'Missing',
        value: 1,
      },
    },
    included_excluded: {
      Included: {
        label: 'Included',
        value: 1,
      },
      Excluded: {
        label: 'Excluded',
        value: 0,
      },
      Missing: {
        label: 'Missing',
        value: 0,
      },
    },
    sex_at_birth: {
      Male: {
        label: 'Male',
        value: 1,
      },
      Female: {
        label: 'Female',
        value: 1,
      },
      Missing: {
        label: 'Missing',
        value: 1,
      },
    },
    sites: {
      YA: { label: 'YA', value: 1 },
      LA: { label: 'LA', value: 1 },
      MA: { label: 'MA', value: 1 },
    },
  },
  graphTable: {
    tableColumns: [
      {
        dataProperty: 'site',
        label: 'Network',
        sortable: true,
      },
      {
        dataProperty: 'Foo',
        label: 'Foo',
        sortable: false,
      },
      {
        dataProperty: 'Bar',
        label: 'Bar',
        sortable: false,
      },
      {
        dataProperty: 'Total',
        label: 'Total',
        sortable: false,
      },
    ],
    tableRows: [
      {
        Bar: '0 / 2 (0%)',
        Foo: '1 / 3 (33%)',
        'N/A': '4',
        Total: '1 / 5 (20%)',
        site: 'Madrid',
      },
      {
        Bar: '0 / 1 (0%)',
        Foo: '1 / 3 (33%)',
        'N/A': '3',
        Total: '1 / 4 (25%)',
        site: 'Yale',
      },
      {
        Foo: '2 / 6 (33%)',
        'N/A': '12',
        Total: '2 / 14 (14%)',
        site: 'Totals',
      },
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
        type: 'rect',
      },
    },
    {
      name: 'Bar',
      symbol: {
        fill: 'red',
        type: 'rect',
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
  lastModified: '',
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
      siteCode: 'MA',
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
      siteCode: 'Totals',
      name: 'Totals',
      percentages: {
        Foo: 7,
        'N/A': 92,
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
    chrcrit_part: {
      HC: {
        label: 'HC',
        value: 0,
      },
      CHR: {
        label: 'CHR',
        value: 0,
      },
      Missing: {
        label: 'Missing',
        value: 0,
      },
    },
    included_excluded: {
      Included: {
        label: 'Included',
        value: 0,
      },
      Excluded: {
        label: 'Excluded',
        value: 0,
      },
      Missing: {
        label: 'Missing',
        value: 0,
      },
    },
    sex_at_birth: {
      Male: {
        label: 'Male',
        value: 1,
      },
      Female: {
        label: 'Female',
        value: 0,
      },
      Missing: {
        label: 'Missing',
        value: 0,
      },
    },
    sites: {
      YA: { label: 'YA', value: 1 },
      LA: { label: 'LA', value: 1 },
      MA: { label: 'MA', value: 1 },
    },
  },
  graphTable: {
    tableColumns: [
      {
        dataProperty: 'site',
        label: 'Network',
        sortable: true,
      },
      {
        dataProperty: 'Foo',
        label: 'Foo',
        sortable: false,
      },
      {
        dataProperty: 'Bar',
        label: 'Bar',
        sortable: false,
      },
      {
        dataProperty: 'Total',
        label: 'Total',
        sortable: false,
      },
    ],
    tableRows: [
      {
        Bar: '0 / 2 (0%)',
        Foo: '1 / 3 (33%)',
        'N/A': '4',
        Total: '1 / 5 (20%)',
        site: 'Madrid',
      },
      {
        Foo: '1 / 3 (33%)',
        'N/A': '13',
        Total: '1 / 14 (7%)',
        site: 'Totals',
      },
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
        type: 'rect',
      },
    },
    {
      name: 'Bar',
      symbol: {
        fill: 'red',
        type: 'rect',
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
  lastModified: '',
  ...overrides,
})
