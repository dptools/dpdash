import { collections } from '../../utils/mongoCollections'

const AssessmentVariablesModel = {
  upsert: async (db, query, assessmentVariableAttributes) =>
    await db.collection(collections.assessmentVariables).findOneAndUpdate(
      query,
      { $set: assessmentVariableAttributes },
      {
        upsert: true,
        returnDocument: 'after',
      }
    ),
}

export default AssessmentVariablesModel
