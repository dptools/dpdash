import AssessmentDayDataService from '.'
import { createSubjectDayData } from '../../../test/fixtures'

describe('AssessmentDayDataService', () => {
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
  const subjectDayData = [
    createSubjectDayData({
      day: 1,
      study: 'study',
      subject: 'subject',
      assessment: 'assessment',
    }),
  ]
  describe('AssessmentDayDataService.filterNewData', () => {
    it('compares the participants stored data and new data and returns only the new data', () => {
      const assessmentDayDataService = new AssessmentDayDataService(
        subjectAssessments,
        subjectDayData
      )

      expect(assessmentDayDataService.filterNewData()).toEqual([
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
      ])
    })
  })

  describe('AssessmentDayDataService.filterUpdateData', () => {
    it('compares the participants stored data and new data and returns only the updated data', () => {
      const assessmentDayDataService = new AssessmentDayDataService(
        subjectAssessments,
        subjectDayData
      )

      expect(assessmentDayDataService.filterUpdatedData()).toEqual([
        {
          day: 1,
          var1: 1,
          var2: 2,
          var3: 'str',
          site: 'study',
        },
      ])
    })
  })
})
