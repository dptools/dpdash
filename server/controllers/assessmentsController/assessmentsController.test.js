import { ObjectId } from 'mongodb'

import assessmentsController from '.'
import {
  createAssessment,
  createRequest,
  createResponse,
} from '../../../test/fixtures'
import { collections } from '../../utils/mongoCollections'

describe('assessmentsController', () => {
  describe('when successful', () => {
    let appDb

    const [assess1, assess2, assess3, assess4] = [
      createAssessment({ name: 'assessment_1', _id: new ObjectId() }),
      createAssessment({ name: 'form', _id: new ObjectId() }),
      createAssessment({ name: 'assessment_2', _id: new ObjectId() }),
      createAssessment({ name: 'pilfer', _id: new ObjectId() }),
    ]
    beforeAll(async () => {
      appDb = await global.MONGO_INSTANCE.db('assessments')

      await appDb
        .collection(collections.assessments)
        .insertMany([assess1, assess2, assess3, assess4])
    })

    afterAll(async () => {
      await appDb.dropDatabase()
    })

    it('returns a list of all assessments', async () => {
      const request = createRequest({
        app: { locals: { appDb } },
      })
      const response = createResponse()

      await assessmentsController.index(request, response)

      expect(response.status).toHaveBeenCalledWith(200)
      expect(response.json).toHaveBeenCalledWith({
        data: [assess1, assess2, assess3, assess4],
      })
    })

    it('returns a list of assessments that match search query', async () => {
      const request = createRequest({
        app: { locals: { appDb } },
        query: { search: 'f' },
      })
      const response = createResponse()

      await assessmentsController.index(request, response)
      expect(response.status).toHaveBeenCalledWith(200)
      expect(response.json).toHaveBeenCalledWith({
        data: [assess2, assess4],
      })
    })
  })
  describe('when unsuccessful', () => {
    it('returns an error', async () => {
      const request = createRequest()
      const response = createResponse()

      request.app.locals.appDb.toArray.mockRejectedValueOnce(
        new Error('This is an error')
      )

      await assessmentsController.index(request, response)

      expect(response.status).toHaveBeenCalledWith(401)
      expect(response.json).toHaveBeenCalledWith({
        error: 'This is an error',
      })
    })
  })
})
