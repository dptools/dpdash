import {
  createAssessmentDayData,
  createSiteParticipant,
  createStudy,
} from './fixtures'
import {
  FILTERS_FORM,
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
    assessment: FILTERS_FORM,
    participant: 'YA1',
    study: 'YA',
    dayData: [{ recruitment_status: 'recruited', day: 4 }],
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
    assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
    participant: 'YA2',
    study: 'YA',
    dayData: [{ chrcrit_part: 1, day: 4 }],
  }),
  createAssessmentDayData({
    assessment: FILTERS_FORM,
    participant: 'YA2',
    study: 'YA',
    dayData: [{ recruitment_status: 'consented', day: 4 }],
  }),
  createAssessmentDayData({
    assessment: SOCIODEMOGRAPHICS_FORM,
    participant: 'YA2',
    study: 'YA',
    dayData: [{ chrdemo_sexassigned: 2, day: 4 }],
  }),
  createAssessmentDayData({
    assessment: 'eeg',
    participant: 'YA3',
    study: 'YA',
    dayData: [{ day: 2, eeg: 'bar', var: 'var', baz: 'baz' }],
  }),
  createAssessmentDayData({
    assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
    participant: 'YA3',
    study: 'YA',
    dayData: [{ chrcrit_part: 1, day: 4 }],
  }),
  createAssessmentDayData({
    assessment: FILTERS_FORM,
    participant: 'YA3',
    study: 'YA',
    dayData: [{ recruitment_status: 'recruited', day: 4 }],
  }),
  createAssessmentDayData({
    assessment: SOCIODEMOGRAPHICS_FORM,
    participant: 'YA3',
    study: 'YA',
    dayData: [{ chrdemo_sexassigned: 2, day: 4 }],
  }),
  createAssessmentDayData({
    assessment: 'eeg',
    participant: 'YA4',
    study: 'YA',
    dayData: [
      { day: 5, eeg: null, var: 'var', baz: 'baz' },
      { eeg: 'foo', var: 'var', baz: 'baz', day: 6 },
    ],
  }),
  createAssessmentDayData({
    assessment: SOCIODEMOGRAPHICS_FORM,
    participant: 'YA4',
    study: 'YA',
    dayData: [{ chrdemo_sexassigned: 2, day: 4 }],
  }),
  createAssessmentDayData({
    assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
    participant: 'YA4',
    study: 'YA',
    dayData: [{ chrcrit_part: 1, day: 4 }],
  }),
  createAssessmentDayData({
    assessment: FILTERS_FORM,
    participant: 'YA4',
    study: 'YA',
    dayData: [{ recruitment_status: 'recruited', day: 4 }],
  }),
  createAssessmentDayData({
    assessment: 'eeg',
    participant: 'MA1',
    study: 'MA',
    dayData: [{ day: 1, eeg: 'foo', var: 'var', baz: 'baz' }],
  }),
  createAssessmentDayData({
    assessment: FILTERS_FORM,
    participant: 'MA1',
    study: 'MA',
    dayData: [{ recruitment_status: 'recruited', day: 4 }],
  }),
  createAssessmentDayData({
    assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
    participant: 'MA1',
    study: 'MA',
    dayData: [{ chrcrit_part: 1, day: 4 }],
  }),
  createAssessmentDayData({
    assessment: SOCIODEMOGRAPHICS_FORM,
    participant: 'MA1',
    study: 'MA',
    dayData: [{ chrdemo_sexassigned: 1, day: 4 }],
  }),
  createAssessmentDayData({
    assessment: 'eeg',
    participant: 'MA2',
    study: 'MA',
    dayData: [{ day: 5, eeg: 'foo', var: 'var', baz: 'baz' }],
  }),
  createAssessmentDayData({
    assessment: FILTERS_FORM,
    participant: 'MA2',
    study: 'MA',
    dayData: [{ recruitment_status: 'not recruited', day: 4 }],
  }),
  createAssessmentDayData({
    assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
    participant: 'MA2',
    study: 'MA',
    dayData: [{ chrcrit_part: 1, day: 4 }],
  }),
  createAssessmentDayData({
    assessment: SOCIODEMOGRAPHICS_FORM,
    participant: 'MA2',
    study: 'MA',
    dayData: [{ chrdemo_sexassigned: 1, day: 4 }],
  }),
  createAssessmentDayData({
    assessment: 'eeg',
    participant: 'MA3',
    study: 'MA',
    dayData: [{ day: 2, eeg: 'foo', var: 'var', baz: 'baz' }],
  }),
  createAssessmentDayData({
    assessment: FILTERS_FORM,
    participant: 'MA3',
    study: 'MA',
    dayData: [{ recruitment_status: 'recruited', day: 4 }],
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
    participant: 'MA4',
    study: 'MA',
    dayData: [
      { day: 5, eeg: null, var: 'var', baz: 'baz' },
      { day: 7, eeg: 'foo', var: 'var', baz: 'baz' },
    ],
  }),
  createAssessmentDayData({
    assessment: FILTERS_FORM,
    participant: 'MA4',
    study: 'MA',
    dayData: [{ recruitment_status: 'recruited', day: 4 }],
  }),
  createAssessmentDayData({
    assessment: INCLUSION_EXCLUSION_CRITERIA_FORM,
    participant: 'MA4',
    study: 'MA',
    dayData: [{ chrcrit_part: 1, day: 4 }],
  }),
  createAssessmentDayData({
    assessment: SOCIODEMOGRAPHICS_FORM,
    participant: 'MA4',
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
    networks: {
      PRESCIENT: { label: 'PRESCIENT', value: 0 },
      ProNET: { label: 'ProNET', value: 0 },
    },
    recruitment_status: {
      'Not recruited': {
        label: 'Not Recruited',
        value: 0,
      },

      Recruited: {
        label: 'Recruited',
        value: 0,
      },
    },
  },
  graphTable: {
    tableColumns: [
      {
        dataProperty: 'site',
        label: 'Site Name',
        sortable: true,
      },
      {
        dataProperty: 'siteCode',
        label: 'Site Code',
        sortable: false,
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
        siteCode: 'MA',
      },
      {
        Bar: '0 / 2 (0%)',
        Foo: '4 / 3 (133%)',
        'N/A': '1',
        Total: '4 / 5 (80%)',
        site: 'UCLA',
        siteCode: 'LA',
      },
      {
        Bar: '2 / 1 (200%)',
        Foo: '2 / 3 (67%)',
        'N/A': '0',
        Total: '4 / 4 (100%)',
        site: 'Yale',
        siteCode: 'YA',
      },
      {
        Bar: '2 / 5 (40%)',
        Foo: '10 / 9 (111%)',
        'N/A': '2',
        Total: '12 / 14 (86%)',
        site: 'Totals',
        siteCode: 'Totals',
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
  chart_id: '',
  chartOwner: {
    display_name: 'Display Name',
    icon: 'icon',
    uid: 'owl',
  },
  dataBySite: [
    {
      counts: {
        Bar: 1,
        Foo: 2,
        'N/A': 1,
        Total: 3,
      },
      name: 'Yale',
      percentages: {
        Bar: 25,
        Foo: 50,
        'N/A': 25,
      },
      siteCode: 'YA',
      targets: {
        Bar: 1,
        Foo: 3,
        Total: 4,
      },
      totalsForStudy: {
        count: 3,
        targetTotal: 4,
      },
    },
    {
      counts: {
        Bar: 1,
        Foo: 5,
        'N/A': 8,
        Total: 6,
      },
      name: 'Totals',
      percentages: {
        Bar: 7.142857142857142,
        Foo: 35.714285714285715,
        'N/A': 57.14285714285714,
      },
      siteCode: 'Totals',
      targets: {
        Bar: 3,
        Foo: 6,
        Total: 14,
      },
      totalsForStudy: {
        count: 6,
        targetTotal: 14,
      },
    },
    {
      counts: {
        Bar: 0,
        Foo: 3,
        'N/A': 2,
        Total: 3,
      },
      name: 'Madrid',
      percentages: {
        Bar: 0,
        Foo: 60,
        'N/A': 40,
      },
      siteCode: 'MA',
      targets: {
        Bar: 2,
        Foo: 3,
        Total: 5,
      },
      totalsForStudy: {
        count: 3,
        targetTotal: 5,
      },
    },
  ],
  description: 'Participant EEG Measurements',
  filters: {
    chrcrit_part: {
      CHR: {
        label: 'CHR',
        value: 1,
      },
      HC: {
        label: 'HC',
        value: 1,
      },
      Missing: {
        label: 'Missing',
        value: 1,
      },
    },
    networks: {
      PRESCIENT: {
        label: 'PRESCIENT',
        value: 0,
      },
      ProNET: {
        label: 'ProNET',
        value: 0,
      },
    },
    recruitment_status: {
      'Not recruited': {
        label: 'Not Recruited',
        value: 0,
      },
      Recruited: {
        label: 'Recruited',
        value: 1,
      },
    },
    sex_at_birth: {
      Female: {
        label: 'Female',
        value: 1,
      },
      Male: {
        label: 'Male',
        value: 1,
      },
      Missing: {
        label: 'Missing',
        value: 1,
      },
    },
    sites: {
      LA: {
        label: 'LA',
        value: 1,
      },
      MA: {
        label: 'MA',
        value: 1,
      },
      YA: {
        label: 'YA',
        value: 1,
      },
    },
  },
  graphTable: {
    tableColumns: [
      {
        dataProperty: 'site',
        label: 'Site Name',
        sortable: true,
      },
      {
        dataProperty: 'siteCode',
        label: 'Site Code',
        sortable: false,
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
        Foo: '3 / 3 (100%)',
        'N/A': '2',
        Total: '3 / 5 (60%)',
        site: 'Madrid',
        siteCode: 'MA',
      },
      {
        Bar: '1 / 1 (100%)',
        Foo: '2 / 3 (67%)',
        'N/A': '1',
        Total: '3 / 4 (75%)',
        site: 'Yale',
        siteCode: 'YA',
      },
      {
        Bar: '1 / 3 (33%)',
        Foo: '5 / 6 (83%)',
        'N/A': '8',
        Total: '6 / 14 (43%)',
        site: 'Totals',
        siteCode: 'Totals',
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
  lastModified: '',
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
      count: 3,
      targetTotal: 5,
    },
    Totals: {
      count: 6,
      targetTotal: 14,
    },
    UCLA: {
      count: 0,
      targetTotal: 5,
    },
    Yale: {
      count: 3,
      targetTotal: 4,
    },
  },
  title: 'Eeg Measurements',
  userSites: ['LA', 'MA', 'YA'],
  ...overrides,
})

export const chartsDataFilterResponse = (overrides = {}) => ({
  chart_id: '',
  chartOwner: {
    display_name: 'Display Name',
    icon: 'icon',
    uid: 'owl',
  },
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
      siteCode: 'MA',
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
      siteCode: 'Totals',
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
      CHR: {
        label: 'CHR',
        value: 0,
      },
      HC: {
        label: 'HC',
        value: 0,
      },
      Missing: {
        label: 'Missing',
        value: 0,
      },
    },
    networks: {
      PRESCIENT: {
        label: 'PRESCIENT',
        value: 0,
      },
      ProNET: {
        label: 'ProNET',
        value: 0,
      },
    },
    recruitment_status: {
      'Not recruited': {
        label: 'Not Recruited',
        value: 1,
      },
      Recruited: {
        label: 'Recruited',
        value: 0,
      },
    },
    sex_at_birth: {
      Female: {
        label: 'Female',
        value: 0,
      },
      Male: {
        label: 'Male',
        value: 1,
      },
      Missing: {
        label: 'Missing',
        value: 0,
      },
    },
    sites: {
      LA: {
        label: 'LA',
        value: 1,
      },
      MA: {
        label: 'MA',
        value: 1,
      },
      YA: {
        label: 'YA',
        value: 1,
      },
    },
  },
  graphTable: {
    tableColumns: [
      {
        dataProperty: 'site',
        label: 'Site Name',
        sortable: true,
      },
      {
        dataProperty: 'siteCode',
        label: 'Site Code',
        sortable: false,
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
        siteCode: 'MA',
      },
      {
        Foo: '1 / 3 (33%)',
        'N/A': '13',
        Total: '1 / 14 (7%)',
        site: 'Totals',
        siteCode: 'Totals',
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
  lastModified: '',
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
  ...overrides,
})

export const createStudies = () => [
  createStudy({
    study: 'YA',
    updatedAt: new Date('01-05-2024'),
    participants: [
      createSiteParticipant({
        participant: 'YA1',
        Active: 1,
        Consent: '2022-06-02',
        study: 'YA',
        daysInStudy: 55,
      }),
      createSiteParticipant({
        participant: 'YA2',
        Active: 1,
        Consent: '2022-06-02',
        study: 'YA',
        daysInStudy: 105,
      }),
    ],
  }),
  createStudy({
    study: 'MA',
    updatedAt: new Date('01-05-2024'),
    participants: [
      createSiteParticipant({
        participant: 'MA1',
        Active: 1,
        Consent: '2022-06-02',
        study: 'MA',
        daysInStudy: 55,
      }),
      createSiteParticipant({
        participant: 'MA2',
        Active: 1,
        Consent: '2022-06-02',
        study: 'MA',
        daysInStudy: 1005,
      }),
    ],
  }),
  createStudy({
    study: 'LA',
    updatedAt: new Date('01-05-2024'),
    participants: [
      createSiteParticipant({
        participant: 'LA1',
        Active: 1,
        Consent: '2022-06-02',
        study: 'LA',
        daysInStudy: 655,
      }),
      createSiteParticipant({
        participant: 'LA2',
        Active: 1,
        Consent: '2022-06-02',
        study: 'LA',
        daysInStudy: 5,
      }),
    ],
  }),
]
