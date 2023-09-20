import ParticipantsController from './'
import {
  createRequestWithUser,
  createResponse,
  createUser,
  createMetadataParticipant,
} from '../../../test/fixtures'

describe('ParticipantsController', () => {
  describe(ParticipantsController.index, () => {
    describe('When successful', () => {
      it('returns a status of 200 and a list of normalized participants', async () => {
        const request = createRequestWithUser()
        const response = createResponse()
        const user = createUser({
          uid: 'owl',
          name: 'Eaurasian Eagle Owl',
          access: ['CA', 'YA'],
          preferences: {
            star: [],
            complete: [],
          },
        })
        const result = [
          createMetadataParticipant({
            subject: 'CA00063',
            synced: '07/28/2022',
            days: 1,
            study: 'CA',
            lastSyncedColor: '#de1d16',
          }),
          createMetadataParticipant({
            subject: 'CA00064',
            synced: '06/24/2022',
            days: 1,
            study: 'CA',
            lastSyncedColor: '#de1d16',
          }),
          createMetadataParticipant({
            subject: 'YA00037',
            synced: '07/28/2022',
            days: 1,
            study: 'YA',
            lastSyncedColor: '#de1d16',
          }),
          createMetadataParticipant({
            subject: 'YA29023',
            synced: '07/28/2022',
            days: 1,
            study: 'YA',
            lastSyncedColor: '#de1d16',
          }),
          createMetadataParticipant({
            subject: 'YA00015',
            synced: '07/28/2022',
            days: 1,
            study: 'YA',
            lastSyncedColor: '#de1d16',
          }),
          createMetadataParticipant({
            subject: 'YA01508',
            synced: '07/28/2022',
            days: 1,
            study: 'YA',
            lastSyncedColor: '#de1d16',
          }),
        ]

        request.app.locals.appDb.findOne.mockResolvedValue(user)
        request.app.locals.dataDb.aggregate.mockImplementationOnce(() => ({
          toArray: () => result,
        }))

        await ParticipantsController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({ data: result })
      })

      it('returns a status of 200 and a list of participants by priority and it appends star or complete property', async () => {
        const request = createRequestWithUser()
        const response = createResponse()
        const user = createUser({
          uid: 'owl',
          name: 'Eaurasian Eagle Owl',
          access: ['CA', 'YA'],
          preferences: {
            star: ['YA00037', 'YA0015'],
            complete: ['CA00063'],
          },
        })
        const result = [
          createMetadataParticipant({
            subject: 'YA00015',
            synced: '07/28/2022',
            days: 1,
            study: 'YA',
            lastSyncedColor: '#de1d16',
            star: true,
          }),
          createMetadataParticipant({
            subject: 'YA00037',
            synced: '07/28/2022',
            days: 1,
            study: 'YA',
            lastSyncedColor: '#de1d16',
            star: true,
          }),
          createMetadataParticipant({
            subject: 'CA00063',
            synced: '07/28/2022',
            days: 1,
            study: 'CA',
            lastSyncedColor: '#de1d16',
            complete: true,
          }),
          createMetadataParticipant({
            subject: 'CA00064',
            synced: '06/24/2022',
            days: 1,
            study: 'CA',
            lastSyncedColor: '#de1d16',
          }),

          createMetadataParticipant({
            subject: 'YA29023',
            synced: '07/28/2022',
            days: 1,
            study: 'YA',
            lastSyncedColor: '#de1d16',
          }),

          createMetadataParticipant({
            subject: 'YA01508',
            synced: '07/28/2022',
            days: 1,
            study: 'YA',
            lastSyncedColor: '#de1d16',
          }),
        ]

        request.app.locals.appDb.findOne.mockResolvedValue(user)
        request.app.locals.dataDb.aggregate.mockImplementationOnce(() => ({
          toArray: () => result,
        }))

        await ParticipantsController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({ data: result })
      })

      it('returns a status of 200 and a list of participants by search query', async () => {
        const request = createRequestWithUser({
          query: {
            searchResults: ['YA29023'],
          },
        })
        const response = createResponse()
        const user = createUser({
          uid: 'owl',
          name: 'Eaurasian Eagle Owl',
          access: ['CA', 'YA'],
          preferences: {
            star: ['YA00037', 'YA0015'],
            complete: ['CA00063'],
          },
        })
        const result = [
          createMetadataParticipant({
            subject: 'YA29023',
            synced: '07/28/2022',
            days: 1,
            study: 'YA',
            lastSyncedColor: '#de1d16',
          }),
        ]

        request.app.locals.appDb.findOne.mockResolvedValue(user)
        request.app.locals.dataDb.aggregate.mockImplementationOnce(() => ({
          toArray: () => result,
        }))

        await ParticipantsController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({ data: result })
      })
    })
    describe('When unsuccessful', () => {
      it('returns a status of 400 and an error message', async () => {
        const request = createRequestWithUser()
        const response = createResponse()

        request.app.locals.appDb.findOne.mockImplementation(() => {
          throw new Error('some error')
        })

        await ParticipantsController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
          error: 'some error',
        })
      })
    })
  })
})
