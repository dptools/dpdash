import { collections } from '../../utils/mongoCollections'

const AssessmentDayDataModel = {
  all: async (db, query) =>
    await db
      .collection(collections.assessmentDayData)
      .find(query, { projection: { participant: 1, _id: 0 } })
      .toArray(),
  findOne: async (db, query) =>
    await db.collection(collections.assessmentDayData).findOne(query),
  upsert: async (db, query, updatedAttributes) =>
    await db.collection(collections.assessmentDayData).findOneAndUpdate(
      query,
      { $set: updatedAttributes },
      {
        upsert: true,
        returnDocument: 'after',
      }
    ),
  createMany: async (db, assessmentDayData) =>
    await db
      .collection(collections.assessmentDayData)
      .insertMany(assessmentDayData),
  index: async (db, query) =>
    await db
      .collection(collections.assessmentDayData)
      .aggregate(query)
      .toArray(),
}

export default AssessmentDayDataModel
