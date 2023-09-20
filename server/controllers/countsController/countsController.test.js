import CountsController from '.'
import {
  createRequestWithUser,
  createResponse,
  createUser,
} from '../../../test/fixtures'

describe('Counts Controller', () => {
  describe('Counts Controller index', () => {
    describe('When successfull', () => {
      it('returns a status of 200 and an object with the different counts for the sidebar', async () => {
        const request = createRequestWithUser()
        const response = createResponse()
        const user = createUser({
          access: ['YA', 'LA', 'CA', 'MA', 'files', 'combined'],
        })
        const mockMetadataCursor = {
          hasNext: jest
            .fn()
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(false),
          next: jest.fn().mockResolvedValueOnce({ end: '3' }),
        }
        const mockParticipantCursor = {
          hasNext: jest
            .fn()
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(false),
          next: jest.fn().mockResolvedValueOnce({
            totalParticipants: '30',
          }),
        }
        request.app.locals.appDb.findOne.mockResolvedValueOnce(user)
        request.app.locals.dataDb
          .find()
          .sort()
          .limit.mockResolvedValueOnce(mockMetadataCursor)

        request.app.locals.dataDb.aggregate.mockResolvedValueOnce(
          mockParticipantCursor
        )

        await CountsController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: { numOfSites: '4', maxDay: '3', numOfParticipants: '30' },
        })
      })
    })
    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error', async () => {
        const request = createRequestWithUser()
        const response = createResponse()
        const user = createUser({
          access: ['YA', 'LA', 'CA', 'MA', 'files', 'combined'],
        })
        request.app.locals.appDb.findOne.mockResolvedValueOnce(user)
        request.app.locals.dataDb
          .find()
          .sort()
          .limit.mockImplementationOnce(() => {
            throw new Error('some error')
          })

        await CountsController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'some error',
        })
      })
    })
  })
})
