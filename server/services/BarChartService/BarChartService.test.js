import { ObjectId } from 'mongodb'
import BarChartService from '.'
import FiltersService, { DEFAULT_FILTERS } from '../FiltersService'
import { collections } from '../../utils/mongoCollections'
import { createChart, createFieldLabelValue } from '../../../test/fixtures'
import { dayDataAssessments } from '../../../test/testUtils'

describe(BarChartService, () => {
  describe('methods', () => {
    describe('createChart', () => {
      let appDb
      const chart = createChart(
        {
          _id: new ObjectId(),
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

      beforeAll(async () => {
        appDb = await global.MONGO_INSTANCE.db('barService')

        await appDb
          .collection(collections.assessmentDayData)
          .insertMany(dayDataAssessments)
      })

      afterAll(async () => {
        await appDb.dropDatabase()
      })
      it('returns data, labels, and study totals', async () => {
        const filters = { ...DEFAULT_FILTERS, sites: ['LA', 'MA', 'YA'] }
        const filterService = new FiltersService(filters)
        const chartService = new BarChartService(appDb, chart, filterService)
        const chartData = await chartService.createChart()
        expect(chartData).toEqual({
          labelMap: new Map()
            .set('Foo', {
              color: '#e2860a',
              name: 'Foo',
            })
            .set('Bar', {
              color: 'red',
              name: 'Bar',
            })
            .set('N/A', {
              color: '#808080',
              name: 'N/A',
            }),

          processedDataBySite: new Map()
            .set('Yale', {
              counts: {
                Bar: 0,
                Foo: 1,
                'N/A': 3,
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
              },
              totalsForStudy: {
                count: 1,
                targetTotal: 4,
              },
            })
            .set('Totals', {
              counts: {
                Foo: 2,
                'N/A': 12,
              },
              name: 'Totals',
              percentages: {
                Foo: 14.285714285714285,
                'N/A': 85.71428571428571,
              },
              targets: {
                Bar: 3,
                Foo: 6,
              },
              totalsForStudy: {
                count: 2,
                targetTotal: 14,
              },
            })
            .set('Madrid', {
              counts: {
                Bar: 0,
                Foo: 1,
                'N/A': 4,
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
              },
              totalsForStudy: {
                count: 1,
                targetTotal: 5,
              },
            }),
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
        })
      })
      it('applies filters', async () => {
        const filters = {
          chrcrit_part: [
            { name: 'HC', value: 'false'},
            { name: 'CHR', value: 'true'},
            { name: 'Missing', value: 'false'},
          ],
          included_excluded: [
            { name: 'Included', value: 'true' },
            { name: 'Excluded', value: 'false'},
            { name: 'Missing', value: 'false' },
          ],
          sex_at_birth: [
            { name: 'Male', value: 'true' },
            { name: 'Female', value: 'false' },
            { name: 'Missing', value: 'false' },
          ],
          sites: ['LA', 'MA', 'YA']
        }
        const filterService = new FiltersService(filters)
        const chartService = new BarChartService(appDb, chart, filterService)
        const chartData = await chartService.createChart()

        expect(chartData).toEqual({
          labelMap: new Map()
            .set('Foo', {
              color: '#e2860a',
              name: 'Foo',
            })
            .set('Bar', {
              color: 'red',
              name: 'Bar',
            })
            .set('N/A', {
              color: '#808080',
              name: 'N/A',
            }),

          processedDataBySite: new Map()
            .set('Madrid', {
              counts: {
                Bar: 0,
                Foo: 1,
                'N/A': 4,
              },
              name: 'Madrid',
              percentages: {
                Bar: 0,
                Foo: 20,
                'N/A': 80,
              },
              targets: {
                Bar: 2,
                Foo: 5,
              },
              totalsForStudy: {
                count: 1,
                targetTotal: 5,
              },
            })
            .set('Totals', {
              counts: {
                Foo: 1,
                'N/A': 13,
              },
              name: 'Totals',
              percentages: {
                Foo: 7.142857142857142,
                'N/A': 92.85714285714286,
              },
              targets: {
                Bar: 2,
                Foo: 3,
              },
              totalsForStudy: {
                count: 1,
                targetTotal: 14,
              },
            })
            .set('Madrid', {
              counts: {
                Bar: 0,
                Foo: 1,
                'N/A': 4,
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
              },
              totalsForStudy: {
                count: 1,
                targetTotal: 5,
              },
            }),
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
        })
      })
    })
  })
  describe('.legend', () => {
    const chart = createChart(
      {
        _id: new ObjectId(),
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

    it('returns a legend object', () => {
      const service = new BarChartService({}, chart, {})

      expect(service.legend()).toEqual([
        { name: 'Foo', symbol: { fill: '#e2860a', type: 'square' } },
        { name: 'Bar', symbol: { fill: 'red', type: 'square' } },
      ])
    })
  })
})
