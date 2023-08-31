import {
  createChart,
  createFieldLabelValue,
  createRequestWithUser,
  createResponse,
  createSubjectAssessment,
  createUser,
} from '../../../test/fixtures'
import chartsController from '.'
import { DEFAULT_CHART_FILTERS } from '../../constants'
import { ObjectId } from 'mongodb'
import { collections } from '../../utils/mongoCollections'

const consoleError = console.error

describe('chartsController', () => {

  beforeEach(() => {
    console.error = jest.fn()
  })

  afterEach(async () => {
    console.error = consoleError
  })

  describe(chartsController.show, () => {
    const response = createResponse()

    beforeEach(async () => {
      await appDb.collection('assessmentSubjectDayData').insertMany([
        createSubjectAssessment({
          assessment: 'assessment',
          collection: 'collection',
          study: 'study',
          subject: 'subject',
          day: 1,
          the_variable: 1,
          sex_at_birth: 1,
        }),
        createSubjectAssessment({
          assessment: 'assessment',
          collection: 'collection',
          study: 'study',
          subject: 'subject',
          day: 2,
          the_variable: 0,
          sex_at_birth: 1,
        })
      ])
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('returns the view chart page', async () => {
      await appDb.collection(collections.users).insertOne(createUser())
      const chartOwner = await appDb.collection(collections.users).findOne()

      await dataDb.collection(collections.charts).insertOne(createChart({
        _id: new ObjectId(),
        owner: chartOwner.uid,
        variable: 'the_variable',
        assessment: 'assessment',
        fieldLabelValueMap: [
          createFieldLabelValue({
            value: 1,
            label: 'one',
            color: 'red',
          }),
          createFieldLabelValue({
            value: 0,
            label: 'zero',
            color: 'blue',
          }),
        ],
      }))
      const chart = await dataDb.collection(collections.charts).findOne()

      const request = createRequestWithUser({
        params: { chart_id: chart._id.toString() },
      })
      request.app.locals.dataDb = dataDb
      request.app.locals.appDb = appDb
      request.session.userAccess = ['study']

      const queryParams = {
        ...DEFAULT_CHART_FILTERS,
        included_excluded: [
          { name: 'Included', value: 'true' },
          { name: 'Excluded', value: 'true' },
          { name: 'Missing', value: 'true' },
        ],
      }
      request.query = Object.keys(queryParams).reduce((acc, key) => {
        for (let i = 0; i < queryParams[key].length; i++) {
          const filter = queryParams[key][i]
          acc.push([encodeURIComponent(`${key}[${i}][name]`), filter.name].join('='))
          acc.push([encodeURIComponent(`${key}[${i}][value]`), filter.value].join('='))
        }
        return acc
      }, []).join('&')

      await chartsController.show(request, response)

      expect(response.status).toHaveBeenCalledWith(200)
      expect(response.json).toHaveBeenCalledWith({
        "data": {
          "chart_id": chart._id.toString(),
          "dataBySite": [
            {
              "name": "study",
              "counts": {
                "one": 1,
                "zero": 1,
                "N/A": 0,
                "Total": 2
              },
              "totalsForStudy": {
                "count": 2
              },
              "percentages": {
                "one": 50,
                "zero": 50,
                "N/A": 0
              },
              "targets": {}
            },
            {
              "name": "Totals",
              "counts": {
                "one": 1,
                "zero": 1,
                "N/A": 0,
                "Total": 2
              },
              "totalsForStudy": {
                "count": 2,
                "targetTotal": 0
              },
              "percentages": {
                "one": 50,
                "zero": 50,
                "N/A": 0
              },
              "targets": {
                "Total": 0
              }
            }
          ],
          "labels": [
            {
              "name": "one",
              "color": "red"
            },
            {
              "name": "zero",
              "color": "blue"
            }
          ],
          "title": "chart title",
          "description": "chart description",
          "legend": [
            {
              "name": "one",
              "symbol": {
                "type": "square",
                "fill": "red"
              }
            },
            {
              "name": "zero",
              "symbol": {
                "type": "square",
                "fill": "blue"
              }
            }
          ],
          "studyTotals": {
            "Totals": {
              "count": 2,
              "targetTotal": 0
            },
            "study": {
              "count": 2
            }
          },
          "filters": {
            "chrcrit_part": [
              {
                "name": "HC",
                "value": "true"
              },
              {
                "name": "CHR",
                "value": "true"
              },
              {
                "name": "Missing",
                "value": "true"
              }
            ],
            "included_excluded": [
              {
                "name": "Included",
                "value": "true"
              },
              {
                "name": "Excluded",
                "value": "true"
              },
              {
                "name": "Missing",
                "value": "true"
              }
            ],
            "sex_at_birth": [
              {
                "name": "Male",
                "value": "true"
              },
              {
                "name": "Female",
                "value": "true"
              },
              {
                "name": "Missing",
                "value": "true"
              }
            ]
          },
          "chartOwner": {
            "uid": "user-uid",
            "display_name": "Display Name",
            "icon": "icon"
          },
          "graphTable": {
            "tableColumns": [
              {
                "name": "Site",
                "color": "gray"
              },
              {
                "name": "one",
                "color": "red"
              },
              {
                "name": "zero",
                "color": "blue"
              },
              {
                "name": "Total",
                "color": "gray"
              }
            ],
            "tableRows": [
              [
                {
                  "data": "study",
                  "color": "gray"
                },
                {
                  "data": "1",
                  "color": "red"
                },
                {
                  "data": "1",
                  "color": "blue"
                },
                {
                  "data": "2",
                  "color": "gray"
                }
              ],
              [
                {
                  "data": "Totals",
                  "color": "gray"
                },
                {
                  "data": "1",
                  "color": "red"
                },
                {
                  "data": "1",
                  "color": "blue"
                },
                {
                  "data": "2",
                  "color": "gray"
                }
              ]
            ]
          }
        }
      })
    })
  })
})
