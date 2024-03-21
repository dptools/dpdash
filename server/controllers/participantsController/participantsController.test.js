import ParticipantsController from './'
import {
  createRequestWithUser,
  createResponse,
  createUser,
  createMetadataParticipant,
  createAssessmentDayData,
} from '../../../test/fixtures'
import { collections } from '../../utils/mongoCollections'

describe('ParticipantsController', () => {
  describe(ParticipantsController.index, () => {
    describe('When successful', () => {
      let appDb

      beforeAll(async () => {
        appDb = await global.MONGO_INSTANCE.db('participants')
      })
      beforeEach(async () => {
        await appDb.createCollection(collections.metadata)
        await appDb.createCollection(collections.users)
        await appDb.createCollection(collections.assessmentDayData)
      })

      afterEach(async () => {
        await appDb.collection(collections.users).drop()
        await appDb.collection(collections.metadata).drop()
        await appDb.collection(collections.assessmentDayData).drop()
      })
      afterAll(async () => {
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
        await appDb.collection(collections.metadata).insertMany([
          {
            study: 'CA',
            participants: [
              createMetadataParticipant({
                Consent: new Date('2022-06-09'),
                participant: 'CA00063',
                synced: new Date('07/28/2022'),
                study: 'CA',
                daysInStudy: 49,
              }),
              createMetadataParticipant({
                Consent: new Date('2022-06-09'),
                participant: 'CA00064',
                synced: new Date('2022-06-24'),
                study: 'CA',
                daysInStudy: 15,
              }),
            ],
          },
          {
            study: 'YA',
            participants: [
              createMetadataParticipant({
                Consent: new Date('2022-06-09'),
                participant: 'YA00037',
                synced: new Date('07/28/2022'),
                study: 'YA',
                daysInStudy: 49,
              }),
              createMetadataParticipant({
                Consent: new Date('2022-06-09'),
                participant: 'YA29023',
                synced: new Date('07/28/2022'),
                study: 'YA',
                daysInStudy: 49,
              }),
              createMetadataParticipant({
                Consent: new Date('2022-06-09'),
                participant: 'YA00015',
                synced: new Date('07/28/2022'),
                study: 'YA',
                daysInStudy: 49,
              }),
              createMetadataParticipant({
                Consent: new Date('2022-06-09'),
                participant: 'YA01508',
                synced: new Date('07/28/2022'),
                study: 'YA',
                daysInStudy: 49,
              }),
            ],
          },
        ])
        await appDb.collection(collections.assessmentDayData).insertMany([
          createAssessmentDayData({
            study: 'CA',
            participant: 'CA00063',
            dayData: [
              {
                day: 49
              }
            ]
          }),
          createAssessmentDayData({
            study: 'CA',
            participant: 'CA00064',
            dayData: [
              {
                day: 15
              }
            ]
          }),
          createAssessmentDayData({
            study: 'YA',
            participant: 'YA00037',
            dayData: [
              {
                day: 49
              }
            ]
          }),
          createAssessmentDayData({
            study: 'YA',
            participant: 'YA29023',
            dayData: [
              {
                day: 49
              }
            ]
          }),
          createAssessmentDayData({
            study: 'YA',
            participant: 'YA00015',
            dayData: [
              {
                day: 49
              }
            ]
          }),
          createAssessmentDayData({
            study: 'YA',
            participant: 'YA01508',
            dayData: [
              {
                day: 49
              }
            ]
          }),
        ])

        const request = createRequestWithUser(
          {
            app: { locals: { appDb } },
          },
          user
        )
        const response = createResponse()

        const result = [
          createMetadataParticipant({
            Consent: new Date('2022-06-09'),
            participant: 'YA00037',
            synced: new Date('07/28/2022'),
            study: 'YA',
            complete: false,
            daysInStudy: 49,
            star: true,
          }),
          createMetadataParticipant({
            Consent: new Date('2022-06-09'),
            participant: 'CA00063',
            synced: new Date('07/28/2022'),
            study: 'CA',
            daysInStudy: 49,
            star: false,
            Consent: new Date('2022-06-09'),
            complete: true,
            daysInStudy: 49,
          }),
          createMetadataParticipant({
            Consent: new Date('2022-06-09'),
            participant: 'CA00064',
            synced: new Date('2022-06-24'),
            study: 'CA',
            complete: false,
            daysInStudy: 15,
            star: false,
          }),
          createMetadataParticipant({
            Consent: new Date('2022-06-09'),
            participant: 'YA00015',
            synced: new Date('07/28/2022'),
            study: 'YA',
            complete: false,
            daysInStudy: 49,
            star: false,
          }),
          createMetadataParticipant({
            Consent: new Date('2022-06-09'),
            participant: 'YA01508',
            synced: new Date('07/28/2022'),
            study: 'YA',
            complete: false,
            daysInStudy: 49,
            star: false,
          }),
          createMetadataParticipant({
            Consent: new Date('2022-06-09'),
            participant: 'YA29023',
            synced: new Date('07/28/2022'),
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
          Consent: new Date('2022-06-09'),
          participant: 'YA29023',
          synced: new Date('07/28/2022'),
          study: 'YA',
          daysInStudy: 49,
        })

        await appDb.collection(collections.users).insertOne(user)
        await appDb.collection(collections.metadata).insertMany([
          {
            study: 'CA',
            participants: [
              createMetadataParticipant({
                Consent: new Date('2022-06-09'),
                participant: 'CA00063',
                synced: new Date('07/28/2022'),
                study: 'CA',
              }),
              createMetadataParticipant({
                Consent: new Date('2022-06-09'),
                participant: 'CA00064',
                synced: new Date('2022-06-24'),
                study: 'CA',
              }),
            ],
          },
          {
            study: 'YA',
            participants: [
              createMetadataParticipant({
                Consent: new Date('2022-06-09'),
                participant: 'YA00037',
                synced: new Date('07/28/2022'),
                study: 'YA',
              }),

              createMetadataParticipant({
                Consent: new Date('2022-06-09'),
                participant: 'YA00015',
                synced: new Date('07/28/2022'),
                study: 'YA',
              }),
              createMetadataParticipant({
                Consent: new Date('2022-06-09'),
                participant: 'YA01508',
                synced: new Date('07/28/2022'),
                study: 'YA',
              }),
              result,
            ],
          },
        ])
        await appDb.collection(collections.assessmentDayData).insertMany([
          createAssessmentDayData({
            study: 'CA',
            participant: 'CA00063',
            dayData: [
              {
                day: 49
              }
            ]
          }),
          createAssessmentDayData({
            study: 'CA',
            participant: 'CA00064',
            dayData: [
              {
                day: 49
              }
            ]
          }),
          createAssessmentDayData({
            study: 'YA',
            participant: 'YA00037',
            dayData: [
              {
                day: 49
              }
            ]
          }),
          createAssessmentDayData({
            study: 'YA',
            participant: 'YA29023',
            dayData: [
              {
                day: 49
              }
            ]
          }),
          createAssessmentDayData({
            study: 'YA',
            participant: 'YA00015',
            dayData: [
              {
                day: 49
              }
            ]
          }),
          createAssessmentDayData({
            study: 'YA',
            participant: 'YA01508',
            dayData: [
              {
                day: 49
              }
            ]
          }),
        ])
        const request = createRequestWithUser(
          {
            app: { locals: { appDb } },
            query: {
              searchParticipants: ['YA29023'],
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
