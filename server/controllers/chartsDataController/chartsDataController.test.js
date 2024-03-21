import {
  createChart,
  createRequestWithUser,
  createResponse,
  createUser,
  createFieldLabelValue,
} from '../../../test/fixtures'
import { ObjectId } from 'mongodb'
import chartsDataController from '.'

import { collections } from '../../utils/mongoCollections'
import {
  chartsDataFilterResponse,
  chartsDataInitialResponse,
  chartsDataSuccessResponse,
  dayDataAssessments,
} from '../../../test/testUtils'

describe('chartsDataController', () => {
  describe(chartsDataController.show, () => {
    describe('when successful', () => {
      let appDb
      let user
      let chart_id

      beforeAll(async () => {
        user = createUser({
          uid: 'owl',
          preferences: {},
          access: ['YA', 'LA', 'MA'],
        })
        chart_id = new ObjectId()
        appDb = await global.MONGO_INSTANCE.db('chartsData')

        await appDb.collection(collections.charts).insertOne(
          createChart(
            {
              _id: chart_id,
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
        )
        await appDb.collection(collections.users).insertOne(user)
        await appDb
          .collection(collections.assessmentDayData)
          .insertMany(dayDataAssessments)
      })

      afterAll(async () => {
        await appDb.dropDatabase()
      })

      test('When all filters are deselected, create a graph object with assessment data counts of a specific variable, assessment value combination', async () => {
        const request = createRequestWithUser(
          {
            app: { locals: { appDb } },
            params: { chart_id: chart_id.toString() },
            query: {
              filters: {
                chrcrit_part: {
                  HC: { label: 'HC', value: '0' },
                  CHR: { label: 'CHR', value: '0' },
                  Missing: { label: 'Missing', value: '0' },
                },
                included_excluded: {
                  Included: { label: 'Included', value: '0' },
                  Excluded: { label: 'Excluded', value: '0' },
                  Missing: { label: 'Missing', value: '0' },
                },
                sex_at_birth: {
                  Male: { label: 'Male', value: '0' },
                  Female: { label: 'Female', value: '0' },
                  Missing: { label: 'Missing', value: '0' },
                },
                sites: {
                  YA: { label: 'YA', value: '1' },
                  LA: { label: 'LA', value: '1' },
                  MA: { label: 'MA', value: '1' },
                },
              },
            },
          },
          user
        )
        const response = createResponse()

        await chartsDataController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: chartsDataSuccessResponse({
            chart_id: chart_id.toString(),
          }),
        })
      })

      test('When data is requested for the first time, the initial filters are applied to the data', async () => {
        const request = createRequestWithUser(
          {
            app: { locals: { appDb } },
            params: { chart_id: chart_id.toString() },
          },
          user
        )
        const response = createResponse()

        await chartsDataController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: chartsDataInitialResponse({
            chart_id: chart_id.toString(),
          }),
        })
      })
      it('returns data when a user selects a specific filter', async () => {
        const request = createRequestWithUser(
          {
            app: { locals: { appDb } },
            params: { chart_id: chart_id.toString() },
            query: {
              filters: {
                chrcrit_part: {
                  HC: { label: 'HC', value: '0' },
                  CHR: { label: 'CHR', value: '0' },
                  Missing: { label: 'Missing', value: '0' },
                },
                included_excluded: {
                  Included: { label: 'Included', value: '0' },
                  Excluded: { label: 'Excluded', value: '0' },
                  Missing: { label: 'Missing', value: '0' },
                },
                sex_at_birth: {
                  Male: { label: 'Male', value: '1' },
                  Female: { label: 'Female', value: '0' },
                  Missing: { label: 'Missing', value: '0' },
                },
                sites: {
                  YA: { label: 'YA', value: '1' },
                  LA: { label: 'LA', value: '1' },
                  MA: { label: 'MA', value: '1' },
                },
              },
            },
          },
          user
        )
        const response = createResponse()

        await chartsDataController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: chartsDataFilterResponse({
            chart_id: chart_id.toString(),
          }),
        })
      })
    })
    describe('when unsuccessful', () => {
      it('returns a status of 500 and a message', async () => {
        const request = createRequestWithUser()
        const response = createResponse()

        request.app.locals.appDb.findOne.mockRejectedValueOnce(
          new Error('This is an error')
        )

        await chartsDataController.show(request, response)

        expect(response.status).toHaveBeenCalledWith(500)
        expect(response.send).toHaveBeenCalledWith({
          message: 'This is an error',
        })
      })
    })
  })
})
