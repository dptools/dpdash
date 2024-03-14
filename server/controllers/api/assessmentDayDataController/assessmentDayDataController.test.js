import AssessmentDayDataController from '.'
import {
  createNewAssessmentDayData,
  createRequest,
  createResponse,
} from '../../../../test/fixtures'
import { collections } from '../../../utils/mongoCollections'

describe('assessmentDayDataController', () => {
  describe(AssessmentDayDataController.create, () => {
    describe('When successful', () => {
      const metadata = {
        path: 'study-participant-assessment-day1to4.csv',
        filetype: 'text/csv',
        encoding: 'utf-8',
        basename: 'study-participant-assessment-day1to4.csv',
        dirname: '/path/to/files',
        mtime: 1234567890.0,
        size: 1024,
        uid: 1000,
        gid: 1000,
        mode: 420,
        role: 'data',
        study: 'study',
        participant: 'participant',
        assessment: 'assessment',
        units: 'day',
        start: '1',
        end: '4',
        extension: '.csv',
        time_end: '4',
        Consent: '2020-01-02',
        Active: 1,
      }
      let appDb

      beforeAll(async () => {
        appDb = await global.MONGO_INSTANCE.db('assessmentDayData')
      })
      beforeEach(async () => {
        await appDb.createCollection(collections.metadata)
        await appDb.createCollection(collections.assessmentDayData)
      })

      afterEach(async () => {
        await appDb.collection(collections.metadata).drop()
        await appDb.collection(collections.assessmentDayData).drop()
      })
      afterAll(async () => {
        await appDb.dropDatabase()
      })

      it('creates a participants assessment day data', async () => {
        const data = createNewAssessmentDayData({
          metadata,
          participant_assessments: [
            {
              day: 1,
              var1: 1,
              var2: 2,
              var3: 'str',
            },
            {
              day: 8,
              var1: 2,
              var2: 2,
              var3: 'str',
              var4: 5,
              var6: 6,
              var7: 'str2',
            },
          ],
        })
        const request = createRequest({
          body: data,
          app: { locals: { appDb } },
        })
        const response = createResponse()

        await AssessmentDayDataController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: 'participant assessment data imported',
        })

        const newDocument = await appDb
          .collection(collections.assessmentDayData)
          .findOne(
            { participant: 'participant' },
            {
              projection: { _id: 0 },
            }
          )

        expect(newDocument).toEqual({
          path: 'study-participant-assessment-day1to4.csv',
          filetype: 'text/csv',
          encoding: 'utf-8',
          basename: 'study-participant-assessment-day1to4.csv',
          dirname: '/path/to/files',
          mtime: 1234567890,
          size: 1024,
          uid: 1000,
          gid: 1000,
          mode: 420,
          role: 'data',
          study: 'study',
          participant: 'participant',
          assessment: 'assessment',
          units: 'day',
          start: '1',
          end: '4',
          extension: '.csv',
          time_end: '4',
          Active: 1,
          Consent: new Date('2020-01-02'),
          dayData: [
            { day: 1, var1: 1, var2: 2, var3: 'str' },
            {
              day: 8,
              var1: 2,
              var2: 2,
              var3: 'str',
              var4: 5,
              var6: 6,
              var7: 'str2',
            },
          ],
        })
      })

      it('updates existing day data records or adds new ones', async () => {
        await appDb.collection(collections.assessmentDayData).insertOne({
          path: 'study-participant-assessment-day1to4.csv',
          filetype: 'text/csv',
          encoding: 'utf-8',
          basename: 'study-participant-assessment-day1to4.csv',
          dirname: '/path/to/files',
          mtime: 1234567890,
          size: 1024,
          uid: 1000,
          gid: 1000,
          mode: 420,
          role: 'data',
          study: 'study',
          participant: 'participant',
          assessment: 'assessment',
          units: 'day',
          start: '1',
          end: '4',
          extension: '.csv',
          time_end: '4',
          dayData: [
            { day: 1, var1: 1, var2: 2, var3: 'str' },
            {
              day: 8,
              var1: 2,
              var2: 2,
              var3: 'str',
              var4: 5,
              var6: 6,
              var7: 'str2',
            },
          ],
        })

        const data = createNewAssessmentDayData({
          metadata: {
            path: 'study-participant-assessment-day1to4.csv',
            filetype: 'text/csv',
            encoding: 'utf-8',
            basename: 'study-participant-assessment-day1to4.csv',
            dirname: '/path/to/files',
            mtime: 1234567890.0,
            size: 1524,
            uid: 1000,
            gid: 1000,
            mode: 420,
            role: 'data',
            study: 'study',
            participant: 'participant',
            assessment: 'assessment',
            units: 'day',
            start: '1',
            end: '12',
            extension: '.csv',
            time_end: '12',
          },
          participant_assessments: [
            {
              day: 1,
              var1: 9,
              var2: 4,
              var3: 'str',
            },
            {
              day: 4,
              var1: 9,
              var2: 4,
              var3: 'str',
            },
            {
              day: 8,
              var1: 2,
              var2: 2,
              var3: 'str',
              var4: 5,
              var6: 6,
              var7: 'str2',
            },
            {
              day: 12,
              var1: 2,
              var2: 2,
              var3: 'str',
              var4: 5,
              var6: 6,
              var7: 'str2',
            },
          ],
        })
        const request = createRequest({
          body: data,
          app: { locals: { appDb } },
        })
        const response = createResponse()

        await AssessmentDayDataController.create(request, response)

        const newDocument = await appDb
          .collection(collections.assessmentDayData)
          .findOne(
            { participant: 'participant' },
            {
              projection: { _id: 0, updatedAt: 0 },
            }
          )

        expect(newDocument).toEqual({
          path: 'study-participant-assessment-day1to4.csv',
          filetype: 'text/csv',
          encoding: 'utf-8',
          basename: 'study-participant-assessment-day1to4.csv',
          dirname: '/path/to/files',
          mtime: 1234567890.0,
          size: 1524,
          uid: 1000,
          gid: 1000,
          mode: 420,
          role: 'data',
          study: 'study',
          participant: 'participant',
          assessment: 'assessment',
          units: 'day',
          start: '1',
          end: '12',
          extension: '.csv',
          time_end: '12',
          Consent: null,
          daysInStudy: 12,
          dayData: [
            {
              day: 1,
              var1: 9,
              var2: 4,
              var3: 'str',
            },
            {
              day: 4,
              var1: 9,
              var2: 4,
              var3: 'str',
            },
            {
              day: 8,
              var1: 2,
              var2: 2,
              var3: 'str',
              var4: 5,
              var6: 6,
              var7: 'str2',
            },
            {
              day: 12,
              var1: 2,
              var2: 2,
              var3: 'str',
              var4: 5,
              var6: 6,
              var7: 'str2',
            },
          ],
        })
      })
      it('creates a metadata document', async () => {
        const data = createNewAssessmentDayData({
          metadata,
          participant_assessments: [
            {
              day: 1,
              var1: 1,
              var2: 2,
              var3: 'str',
            },
            {
              day: 8,
              var1: 2,
              var2: 2,
              var3: 'str',
              var4: 5,
              var6: 6,
              var7: 'str2',
            },
          ],
        })
        const request = createRequest({
          body: data,
          app: { locals: { appDb } },
        })
        const response = createResponse()

        await AssessmentDayDataController.create(request, response)

        const newDocument = await appDb
          .collection(collections.metadata)
          .findOne(
            { study: 'study' },
            {
              projection: {
                _id: 0,
                'participants.synced': 0,
              },
            }
          )

        expect(newDocument).toEqual({
          study: 'study',
          participants: [
            {
              Active: 1,
              Consent: new Date('2020-01-02'),
              study: 'study',
              participant: 'participant',
              daysInStudy: 8,
            },
          ],
        })
        expect(newDocument.participants.length).toEqual(1)
      })

      it('updates a metadata document', async () => {
        const participant = {
          Active: 1,
          study: 'study',
          participant: 'participant',
          Consent: new Date('2022-06-09'),
        }

        await appDb.collection(collections.metadata).insertOne({
          study: 'study',
          participants: [participant],
        })

        const data = createNewAssessmentDayData({
          metadata: {
            path: 'study-participant-assessment-day1to4.csv',
            filetype: 'text/csv',
            encoding: 'utf-8',
            basename: 'study-participant-assessment-day1to4.csv',
            dirname: '/path/to/files',
            mtime: 1234567890.0,
            size: 1024,
            uid: 1000,
            gid: 1000,
            mode: 420,
            role: 'data',
            study: 'study',
            participant: 'participant',
            assessment: 'assessment',
            units: 'day',
            start: '1',
            end: '4',
            extension: '.csv',
            time_end: '4',
          },
          participant_assessments: [
            {
              day: 1,
              var1: 1,
              var2: 2,
              var3: 'str',
            },
            {
              day: 8,
              var1: 2,
              var2: 2,
              var3: 'str',
              var4: 5,
              var6: 6,
              var7: 'str2',
            },
          ],
        })
        const request = createRequest({
          body: data,
          app: { locals: { appDb } },
        })
        const response = createResponse()

        await AssessmentDayDataController.create(request, response)

        const newDocument = await appDb
          .collection(collections.metadata)
          .findOne(
            { study: 'study' },
            {
              projection: {
                _id: 0,
              },
            }
          )

          expect(newDocument.participants[0]).toHaveProperty('synced')
          expect(newDocument.participants[0].daysInStudy).toEqual(8)
        })
    })
    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message when payload is missing', async () => {
        const request = createRequest()
        const response = createResponse()

        await AssessmentDayDataController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          message: 'Nothing to import',
        })
      })

      it('returns a status of 400 and an error message', async () => {
        const request = createRequest({
          body: {
            metadata: { assessment: 'assessment' },
            participant_assessments: [{}],
          },
        })
        const response = createResponse()

        request.app.locals.appDb.findOne.mockRejectedValueOnce(
          new Error('some error')
        )

        await AssessmentDayDataController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          message: 'some error',
        })
      })
    })
  })
})
