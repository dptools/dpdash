import { MongoClient } from 'mongodb';
import SubjectModel from '.';
import { createFilters, createSubjectAssessment, createToc } from '../../../test/fixtures';

describe('SubjectModel', () => {
  it('returns an array of unique subjects', async () => {
    await appDb.collection('assessmentSubjectDayData').insertMany([
      createSubjectAssessment({
        assessment: 'test_assessment',
        collection: 'test_collection',
        study: 'test_study',
        subject: 'test_subject',
        day: 1,
      }),
      createSubjectAssessment({
        assessment: 'test_assessment',
        collection: 'test_collection',
        study: 'test_study',
        subject: 'test_subject',
        day: 2,
      }),
    ])

  const res = await SubjectModel.allForAssessment(appDb, 'test_assessment', ['test_study'], createFilters())

  expect(res).toEqual([
    {
      study: 'test_study',
      subject: 'test_subject',
      collection: 'test_collection'
    }
  ])
  })
})
