import AssessmentVariablesModel from '.'
import { createAsessmentVariable } from '../../../test/fixtures'
import { collections } from '../../utils/mongoCollections'

describe('AssessmentVariablesModel', () => {
  let appDb

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
  beforeAll(async () => {
    appDb = await global.MONGO_INSTANCE.db('assessment_vars')
  })
  beforeEach(async () => {
    await appDb.createCollection(collections.assessmentVariables)
  })

  afterEach(async () => {
    await appDb.collection(collections.assessmentVariables).drop()
  })
  afterAll(async () => {
    await appDb.dropDatabase()
  })

  it('creates new assessment variables', async () => {
    const newAssessment = 'new_assess_id'
    const newVariables = initialAssessmentVariables.map(({ name }) => ({
      name,
      assessment_id: newAssessment,
    }))
    await Promise.all(
      newVariables.map(
        async (variableMetadata) =>
          await AssessmentVariablesModel.upsert(
            appDb,
            variableMetadata,
            variableMetadata
          )
      )
    )

    const insertedVariables = await appDb
      .collection(collections.assessmentVariables)
      .find({ assessment_id: newAssessment })
      .project({ _id: 0 })
      .sort({ name: 1 })
      .toArray()

    expect(insertedVariables).toEqual(newVariables)
  })

  it('will add only new variables to the database, and will not duplicate any variables', async () => {
    const importedAssessment = 'already_imported'
    await Promise.all(
      initialAssessmentVariables.map(
        async ({ name }) =>
          await AssessmentVariablesModel.upsert(
            appDb,
            {
              name,
              assessment_id: importedAssessment,
            },
            {
              name,
              assessment_id: importedAssessment,
            }
          )
      )
    )
    const mixedPayload = [
      createAsessmentVariable({
        name: 'var1',
        assessment_id: importedAssessment,
      }),
      createAsessmentVariable({
        name: 'var2',
        assessment_id: importedAssessment,
      }),
      createAsessmentVariable({
        name: 'var3',
        assessment_id: importedAssessment,
      }),
      createAsessmentVariable({
        name: 'var4',
        assessment_id: importedAssessment,
      }),
      createAsessmentVariable({
        name: 'var6',
        assessment_id: importedAssessment,
      }),
      createAsessmentVariable({
        name: 'var7',
        assessment_id: importedAssessment,
      }),
      createAsessmentVariable({
        name: 'var5',
        assessment_id: importedAssessment,
      }),
      createAsessmentVariable({
        name: 'new-var1',
        assessment_id: importedAssessment,
      }),
      createAsessmentVariable({
        name: 'newvar2',
        assessment_id: importedAssessment,
      }),
    ]
    await Promise.all(
      mixedPayload.map(
        async (variableMetadata) =>
          await AssessmentVariablesModel.upsert(
            appDb,
            variableMetadata,
            variableMetadata
          )
      )
    )
    const insertedData = await appDb
      .collection(collections.assessmentVariables)
      .find({ assessment_id: importedAssessment }, { projection: { _id: 0 } })
      .toArray()

    expect(insertedData.length).toEqual(mixedPayload.length)
    expect(insertedData.map(({ name }) => name).sort()).toEqual(
      mixedPayload.map(({ name }) => name).sort()
    )
  })

  it('will not duplicate any data already present in the db', async () => {
    const oldAssessment = 'old-assessment'
    const varsToInsert = initialAssessmentVariables.map(async ({ name }) => ({
      name,
      assessment_id: oldAssessment,
    }))

    await Promise.all(
      varsToInsert.map(
        async (variableMetadata) =>
          await AssessmentVariablesModel.upsert(
            appDb,
            variableMetadata,
            variableMetadata
          )
      )
    )
    const alreadyInserted = await appDb
      .collection(collections.assessmentVariables)
      .find({ assessment_id: oldAssessment })
      .toArray()

    await Promise.all(
      varsToInsert.map(
        async (variableMetadata) =>
          await AssessmentVariablesModel.upsert(
            appDb,
            variableMetadata,
            variableMetadata
          )
      )
    )

    const reImportedData = await appDb
      .collection(collections.assessmentVariables)
      .find({ assessment_id: oldAssessment })
      .toArray()

    expect(alreadyInserted).toEqual(reImportedData)
  })
})
