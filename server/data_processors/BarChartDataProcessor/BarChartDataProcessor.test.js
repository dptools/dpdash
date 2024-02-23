import BarChartDataProcessor from '.'
import { dayDataAssessments } from '../../../test/testUtils'
import { createChart, createFieldLabelValue } from '../../../test/fixtures'
import { TOTALS_STUDY } from '../../constants'

describe(BarChartDataProcessor, () => {
  const chart = createChart(
    {
      title: 'Eeg Measurements',
      description: 'Participant EEG Measurements',
      assessment: 'eeg',
      variable: 'eeg',
      public: false,
      owner: 'owl',
    },
    [
      createFieldLabelValue({
        value: 'bar',
        label: 'Bar',
        color: 'red',
        targetValues: {
          LA: '2',
          YA: '1',
          MA: '2',
        },
      }),
    ]
  )
  const initialStudyTotals = {
    [TOTALS_STUDY]: { count: 0, targetTotal: 0 },
    'Site 1': { count: 0, targetTotal: undefined },
    'Site 2': { count: 0, targetTotal: undefined },
  }
  const participants = dayDataAssessments

  describe('.processData', () => {
    it('returns processed data', async () => {
      const service = new BarChartDataProcessor(chart, initialStudyTotals)
      participants.forEach((doc) => service.processDocument(doc))

      const processedData = service.processData()
      const expectedLabelMap = {
        Bar: {
          color: 'red',
          name: 'Bar',
        },
        Foo: {
          color: '#e2860a',
          name: 'Foo',
        },
      }
      const expectedDataMap = {
        'Madrid-Bar-2': 0,
        'Madrid-Foo-3': 4,
        'Totals-Bar': 2,
        'Totals-Foo': 10,
        'UCLA-Bar-2': 0,
        'UCLA-Foo-3': 4,
        'Yale-Bar-1': 2,
        'Yale-Foo-3': 2,
      }
      const expectedProcessedDataBySite = {
        Madrid: {
          counts: {
            Bar: 0,
            Foo: 4,
            'N/A': 0,
          },
          name: 'Madrid',
          percentages: {
            Bar: 0,
            Foo: 100,
            'N/A': 0,
          },
          targets: {
            Bar: 2,
            Foo: 3,
          },
          totalsForStudy: {
            count: 4,
            targetValue: '3',
          },
        },
        Totals: {
          counts: {
            Bar: 2,
            Foo: 10,
            'N/A': 0,
          },
          name: 'Totals',
          percentages: {
            Bar: 16.666666666666664,
            Foo: 83.33333333333334,
            'N/A': 0,
          },
          targets: {
            Bar: 5,
            Foo: 9,
          },
          totalsForStudy: {
            count: 12,
            targetTotal: 0,
          },
        },
        UCLA: {
          counts: {
            Bar: 0,
            Foo: 4,
            'N/A': 0,
          },
          name: 'UCLA',
          percentages: {
            Bar: 0,
            Foo: 100,
            'N/A': 0,
          },
          targets: {
            Bar: 2,
            Foo: 3,
          },
          totalsForStudy: {
            count: 4,
            targetValue: '3',
          },
        },
        Yale: {
          counts: {
            Bar: 2,
            Foo: 2,
            'N/A': 0,
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
          },
          totalsForStudy: {
            count: 4,
            targetValue: '3',
          },
        },
      }

      expect(processedData.processedDataBySite).toEqual(
        new Map(Object.entries(expectedProcessedDataBySite))
      )
      expect(processedData.dataMap).toEqual(
        new Map(Object.entries(expectedDataMap))
      )
      expect(processedData.labelMap).toEqual(
        new Map(Object.entries(expectedLabelMap))
      )
    })
  })
})
