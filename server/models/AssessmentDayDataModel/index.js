import { collections } from '../../utils/mongoCollections'

const AssessmentDayDataModel = {
  all: async (db, query) =>
    await db
      .collection(collections.assessmentDayData)
      .find(query, { projection: { participant: 1, _id: 0 } })
      .toArray(),
  findOne: async (db, query) =>
    await db.collection(collections.assessmentDayData).findOne(query),
  create: async (db, participantData) =>
    await db
      .collection(collections.assessmentDayData)
      .insertOne(participantData),
  createMany: async (db, assessmentDayData) =>
    await db
      .collection(collections.assessmentDayData)
      .insertMany(assessmentDayData),
  update: async (db, query, assessmentDayDataAttributes) =>
    await db
      .collection(collections.assessmentDayData)
      .updateOne(query, { $set: assessmentDayDataAttributes }),
  index: async (db, query) =>
    await db
      .collection(collections.assessmentDayData)
      .aggregate(query)
      .toArray(),
}

export default AssessmentDayDataModel
