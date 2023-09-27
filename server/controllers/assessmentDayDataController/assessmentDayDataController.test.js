import AssessmentDayDataController from '.'
import {
  createNewAssessmentDayData,
  createRequest,
  createResponse,
} from '../../../test/fixtures'
import AssessmentDayDataService from '../../services/AssessmentDayDataService'

jest.mock('../../services/AssessmentDayDataService')

describe('assessmentDayDataController', () => {
  const subjectAssessments = [
    {
      day: 1,
      var1: 1,
      var2: 2,
      var3: 'str',
      site: 'study',
    },
    {
      day: 4,
      var1: 2,
      var2: 2,
      var3: 'str',
      var4: 5,
      var6: 6,
      var7: 'str2',
      site: 'study',
    },
  ]
  const importedData = createNewAssessmentDayData({
    metadata: {
      path: 'study-subject-assessment-day1to4.csv',
      filetype: 'text/csv',
      encoding: 'utf-8',
      basename: 'study-subject-assessment-day1to4.csv',
      dirname: '/path/to/files',
      mtime: 1234567890.0,
      size: 1024,
      uid: 1000,
      gid: 1000,
      mode: 420,
      role: 'data',
      study: 'study',
      subject: 'subject',
      assessment: 'assessment',
      units: 'day',
      start: '1',
      end: '4',
      extension: '.csv',
      time_end: '4',
    },
    subject_assessments: subjectAssessments,
  })

  describe(AssessmentDayDataController.create, () => {
    describe('When successful', () => {
      const mockFilterNewData = jest.fn()
      const mockFilterUpdateData = jest.fn()

      beforeEach(() => {
        AssessmentDayDataService.mockImplementationOnce(() => {
          return {
            filterNewData: mockFilterNewData.mockReturnValue([
              {
                day: 4,
                var1: 2,
                var2: 2,
                var3: 'str',
                var4: 5,
                var6: 6,
                var7: 'str2',
                site: 'study',
              },
            ]),
            filterUpdatedData: mockFilterUpdateData.mockReturnValue([
              {
                day: 1,
                var1: 1,
                var2: 2,
                var3: 'str',
                site: 'study',
                subject: 'subject',
              },
            ]),
          }
        })
      })

      afterEach(() => {
        jest.resetAllMocks()
      })
      it('returns a status of 200', async () => {
        const request = createRequest({ body: importedData })
        const response = createResponse()

        request.app.locals.dataDb.find.mockImplementationOnce()
        request.app.locals.dataDb.findOneAndUpdate.mockImplementationOnce()
        request.app.locals.dataDb.updateOne.mockImplementationOnce()
        request.app.locals.dataDb.insertMany.mockImplementationOnce()

        await AssessmentDayDataController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: 'Imported successfully',
        })
      })
    })
    describe('When unsuccessful', () => {
      it('returns a status of 400 when unsuccessful', async () => {
        const request = createRequest({ body: importedData })
        const response = createResponse()

        request.app.locals.dataDb.toArray.mockRejectedValueOnce(
          new Error('some error')
        )

        await AssessmentDayDataController.create(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ message: 'some error' })
      })
    })
  })
})
