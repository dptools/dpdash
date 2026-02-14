import AssessmentDayDataController from '.'
import {
  createAssessmentDayData,
  createAssessmentDayDataMetadata,
  createNewAssessmentDayData,
  createRequest,
  createResponse,
  createAsessmentVariable,
  createParticipantDayData,
} from '../../../../test/fixtures'
import AssessmentVariablesModel from '../../../models/AssessmentVariablesModel'
import { collections } from '../../../utils/mongoCollections'

describe('assessmentDayDataController', () => {
  let appDb

  beforeAll(async () => {
    appDb = await global.MONGO_INSTANCE.db()
  })
  beforeEach(async () => {
    await appDb.createCollection(collections.metadata)
    await appDb.createCollection(collections.assessmentDayData)
    await appDb.createCollection(collections.assessments)
    await appDb.createCollection(collections.assessmentVariables)
  })

  afterEach(async () => {
    const existingCollections = await appDb.listCollections().toArray()
    const collectionNames = existingCollections.map((c) => c.name)
    if (collectionNames.includes(collections.metadata)) {
      await appDb.collection(collections.metadata).drop()
    }
    if (collectionNames.includes(collections.assessmentDayData)) {
      await appDb.collection(collections.assessmentDayData).drop()
    }
    if (collectionNames.includes(collections.assessments)) {
      await appDb.collection(collections.assessments).drop()
    }
    if (collectionNames.includes(collections.assessmentVariables)) {
      await appDb.collection(collections.assessmentVariables).drop()
    }
  })
  afterAll(async () => {
    await appDb.dropDatabase()
  })

  describe(AssessmentDayDataController.create, () => {
    describe('When successful', () => {
      const initialAssessmentVariables = [
        createAsessmentVariable({
          name: 'var1',
        }),
        createAsessmentVariable({
          name: 'var2',
        }),
        createAsessmentVariable({
          name: 'var3',
        }),
        createAsessmentVariable({
          name: 'var4',
        }),
        createAsessmentVariable({
          name: 'var6',
        }),
        createAsessmentVariable({
          name: 'var7',
        }),
      ]
      const assessmentDayDataControllerMetadata =
        createAssessmentDayDataMetadata({
          study: 'study',
          participant: 'participant',
          assessment: 'assessment',
          units: 'day',
          start: '1',
          end: '4',
          time_end: '4',
          Consent: new Date('2020-01-02'),
        })
      const updatedParticipantDayData = [
        createParticipantDayData({
          day: 1,
          var1: 9,
          var2: 4,
          var3: 'str',
        }),
        createParticipantDayData({
          day: 4,
          var1: 9,
          var2: 4,
          var3: 'str',
        }),
        createParticipantDayData({
          day: 8,
          var1: 2,
          var2: 2,
          var3: 'str',
          var4: 5,
          var6: 6,
          var7: 'str2',
        }),
        createParticipantDayData({
          day: 12,
          var1: 2,
          var2: 2,
          var3: 'str',
          var4: 5,
          var6: 6,
          var7: 'str2',
        }),
      ]
      const initialParticipantDayData = [
        createParticipantDayData({
          day: 1,
          var1: 1,
          var2: 2,
          var3: 'str',
        }),
        createParticipantDayData({
          day: 8,
          var1: 2,
          var2: 2,
          var3: 'str',
          var4: 5,
          var6: 6,
          var7: 'str2',
        }),
      ]

      it('creates a participants assessment day data', async () => {
        const data = createNewAssessmentDayData({
          metadata: assessmentDayDataControllerMetadata,
          participant_assessments: initialParticipantDayData,
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
          ...assessmentDayDataControllerMetadata,
          dayData: initialParticipantDayData,
        })
      })

      it('updates existing day data records or adds new ones', async () => {
        await appDb.collection(collections.assessmentDayData).insertOne({
          ...assessmentDayDataControllerMetadata,
          dayData: initialParticipantDayData,
        })

        const data = createNewAssessmentDayData({
          metadata: createAssessmentDayDataMetadata({
            ...assessmentDayDataControllerMetadata,
            end: '12',
            time_end: '12',
          }),
          participant_assessments: updatedParticipantDayData,
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
          ...createAssessmentDayDataMetadata({
            ...assessmentDayDataControllerMetadata,
            end: '12',
            time_end: '12',
            daysInStudy: 12,
            Active: 1,
            Consent: new Date('2020-01-02'),
            assessment: 'assessment',
          }),
          dayData: updatedParticipantDayData,
        })
      })
      it('creates a metadata document', async () => {
        const data = createNewAssessmentDayData({
          metadata: assessmentDayDataControllerMetadata,
          participant_assessments: initialParticipantDayData,
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
                updatedAt: 0,
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
          metadata: assessmentDayDataControllerMetadata,
          participant_assessments: initialParticipantDayData,
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
      it('creates new assessment and assessment variables documents', async () => {
        const newAssessment = 'initialAssessment'
        const assessment_variables = initialAssessmentVariables
        const data = createNewAssessmentDayData({
          metadata: createAssessmentDayDataMetadata({
            ...assessmentDayDataControllerMetadata,
            assessment: newAssessment,
          }),
          participant_assessments: initialParticipantDayData,
          assessment_variables,
        })
        const request = createRequest({
          body: data,
          app: { locals: { appDb } },
        })
        const response = createResponse()

        await AssessmentDayDataController.create(request, response)

        const assessmentDocument = await appDb
          .collection(collections.assessments)
          .findOne({
            name: newAssessment,
          })
        const assessmentVariables = await appDb
          .collection(collections.assessmentVariables)
          .find(
            { assessment_id: assessmentDocument._id },
            { projection: { _id: 0, assessment_id: 0 } }
          )
          .sort({ name: 1 })
          .toArray()

        expect(assessmentVariables).toEqual(assessment_variables)
        expect(assessmentDocument.name).toEqual(newAssessment)
      })
      it('Updates the assessment variables when there are new variables', async () => {
        const assessmentVariableSpy = jest.spyOn(
          AssessmentVariablesModel,
          'upsert'
        )
        const newAssessment = 'update-vars-assessment'
        const newAssessmentVariables = [
          createAsessmentVariable({
            name: 'var1',
          }),
          createAsessmentVariable({
            name: 'var2',
          }),
          createAsessmentVariable({
            name: 'var3',
          }),
          createAsessmentVariable({
            name: 'var4',
          }),
          createAsessmentVariable({
            name: 'var6',
          }),
          createAsessmentVariable({
            name: 'var7',
          }),
          createAsessmentVariable({
            name: 'var5',
          }),
          createAsessmentVariable({
            name: 'new-var1',
          }),
          createAsessmentVariable({
            name: 'newvar2',
          }),
        ]

        const data = createNewAssessmentDayData({
          metadata: createAssessmentDayDataMetadata({
            ...assessmentDayDataControllerMetadata,
            assessment: newAssessment,
          }),
          participant_assessments: initialParticipantDayData,
          assessment_variables: newAssessmentVariables,
        })
        const request = createRequest({
          body: data,
          app: { locals: { appDb } },
        })
        const response = createResponse()

        await AssessmentDayDataController.create(request, response)
        const assessment = await appDb
          .collection(collections.assessments)
          .findOne({ name: newAssessment })

        newAssessmentVariables.forEach((variable, i) => {
          expect(assessmentVariableSpy.mock.calls[i]).toEqual([
            appDb,
            {
              name: variable.name,
              assessment_id: assessment._id,
            },
            {
              name: variable.name,
              assessment_id: assessment._id,
            },
          ])
        })
        expect(assessmentVariableSpy).toBeCalledTimes(
          newAssessmentVariables.length
        )
        assessmentVariableSpy.mockClear()
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
    })
  })
  describe(AssessmentDayDataController.destroy, () => {
    describe('when successful', () => {
      it('deletes all documents in the assessmentDayData collection', async () => {
        await appDb
          .collection(collections.assessmentDayData)
          .insertMany([createAssessmentDayData(), createAssessmentDayData()])

        const request = createRequest({
          app: { locals: { appDb } },
        })

        const response = createResponse()

        await AssessmentDayDataController.destroy(request, response)

        const remainingCollections = await appDb.listCollections().toArray()
        expect(response.status).toHaveBeenCalledWith(200)
        expect(
          remainingCollections
            .map((c) => c.name)
            .includes(collections.assessmentDayData)
        ).toBe(false)
      })
    })
  })
})
