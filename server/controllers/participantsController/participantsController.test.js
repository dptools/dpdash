import ParticipantsController from './'
import {
  createRequestWithUser,
  createResponse,
  createUser,
  createMetadataParticipant,
} from '../../../test/fixtures'
import { collections } from '../../utils/mongoCollections'

describe('ParticipantsController', () => {
  describe(ParticipantsController.index, () => {
    describe('When successful', () => {
      let dataDb
      let appDb

      beforeAll(async () => {
        dataDb = await global.MONGO_INSTANCE.db('dpdata')
        appDb = await global.MONGO_INSTANCE.db('appDb')
      })
      beforeEach(async () => {
        await dataDb.createCollection(collections.metadata)
        await appDb.createCollection(collections.users)
      })

      afterEach(async () => {
        await appDb.collection(collections.users).drop()
        await dataDb.collection(collections.metadata).drop()
      })
      afterAll(async () => {
        await dataDb.dropDatabase()
        await appDb.dropDatabase()
      })

      it('returns a status of 200 and a list of participants that are sorted by users favorites then participant in ascending order ', async () => {
        const user = createUser({
          uid: 'owl',
          name: 'Eaurasian Eagle Owl',
          access: ['CA', 'YA'],
          preferences: {
            star: { YA: ['YA00037', 'YA0015'] },
            complete: { CA: ['CA00063'] },
          },
        })

        await appDb.collection(collections.users).insertOne(user)
        await dataDb.collection(collections.metadata).insertMany([
          {
            study: 'CA',
            subjects: [
              createMetadataParticipant({
                Consent: '2022-06-09',
                subject: 'CA00063',
                synced: '07/28/2022',
                study: 'CA',
              }),
              createMetadataParticipant({
                Consent: '2022-06-09',
                subject: 'CA00064',
                synced: '06/24/2022',
                study: 'CA',
              }),
            ],
          },
          {
            study: 'YA',
            subjects: [
              createMetadataParticipant({
                Consent: '2022-06-09',
                subject: 'YA00037',
                synced: '07/28/2022',
                study: 'YA',
              }),
              createMetadataParticipant({
                Consent: '2022-06-09',
                subject: 'YA29023',
                synced: '07/28/2022',
                study: 'YA',
              }),
              createMetadataParticipant({
                Consent: '2022-06-09',
                subject: 'YA00015',
                synced: '07/28/2022',
                study: 'YA',
              }),
              createMetadataParticipant({
                Consent: '2022-06-09',
                subject: 'YA01508',
                synced: '07/28/2022',
                study: 'YA',
              }),
            ],
          },
        ])
        const request = createRequestWithUser(
          {
            app: { locals: { dataDb: dataDb, appDb: appDb } },
          },
          user
        )
        const response = createResponse()

        const result = [
          createMetadataParticipant({
            Consent: '2022-06-09',
            subject: 'YA00037',
            synced: '07/28/2022',
            study: 'YA',
            complete: false,
            daysInStudy: 49,
            star: true,
          }),
          createMetadataParticipant({
            Consent: '2022-06-09',
            subject: 'CA00063',
            synced: '07/28/2022',
            study: 'CA',
            daysInStudy: 49,
            star: false,
            Consent: '2022-06-09',
            complete: true,
            daysInStudy: 49,
          }),
          createMetadataParticipant({
            Consent: '2022-06-09',
            subject: 'CA00064',
            synced: '06/24/2022',
            study: 'CA',
            complete: false,
            daysInStudy: 15,
            star: false,
          }),
          createMetadataParticipant({
            Consent: '2022-06-09',
            subject: 'YA00015',
            synced: '07/28/2022',
            study: 'YA',
            complete: false,
            daysInStudy: 49,
            star: false,
          }),
          createMetadataParticipant({
            Consent: '2022-06-09',
            subject: 'YA01508',
            synced: '07/28/2022',
            study: 'YA',
            complete: false,
            daysInStudy: 49,
            star: false,
          }),
          createMetadataParticipant({
            Consent: '2022-06-09',
            subject: 'YA29023',
            synced: '07/28/2022',
            study: 'YA',
            complete: false,
            daysInStudy: 49,
            star: false,
          }),
        ]

        await ParticipantsController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({ data: result })
      })

      it('returns a status of 200 and a list of participants by search query', async () => {
        const user = createUser({
          uid: 'owl',
          name: 'Eaurasian Eagle Owl',
          access: ['CA', 'YA'],
          preferences: {
            star: { YA: ['YA00037', 'YA0015'] },
            complete: { CA: ['CA00063'] },
          },
        })
        const result = createMetadataParticipant({
          Consent: '2022-06-09',
          subject: 'YA29023',
          synced: '07/28/2022',
          study: 'YA',
        })

        await appDb.collection(collections.users).insertOne(user)
        await dataDb.collection(collections.metadata).insertMany([
          {
            study: 'CA',
            subjects: [
              createMetadataParticipant({
                Consent: '2022-06-09',
                subject: 'CA00063',
                synced: '07/28/2022',
                study: 'CA',
              }),
              createMetadataParticipant({
                Consent: '2022-06-09',
                subject: 'CA00064',
                synced: '06/24/2022',
                study: 'CA',
              }),
            ],
          },
          {
            study: 'YA',
            subjects: [
              createMetadataParticipant({
                Consent: '2022-06-09',
                subject: 'YA00037',
                synced: '07/28/2022',
                study: 'YA',
              }),

              createMetadataParticipant({
                Consent: '2022-06-09',
                subject: 'YA00015',
                synced: '07/28/2022',
                study: 'YA',
              }),
              createMetadataParticipant({
                Consent: '2022-06-09',
                subject: 'YA01508',
                synced: '07/28/2022',
                study: 'YA',
              }),
              result,
            ],
          },
        ])
        const request = createRequestWithUser(
          {
            app: { locals: { dataDb: dataDb, appDb: appDb } },
            query: {
              searchSubjects: ['YA29023'],
            },
          },
          user
        )
        const response = createResponse()

        await ParticipantsController.index(request, response)

        expect(response.status).toHaveBeenCalledWith(200)
        expect(response.json).toHaveBeenCalledWith({
          data: [{ ...result, complete: false, daysInStudy: 49, star: false }],
        })
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
