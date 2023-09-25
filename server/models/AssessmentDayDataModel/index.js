const AssessmentDayDataModel = {
  all: async (db, assessmentCollection) =>
    await db
      .collection(assessmentCollection)
      .find({}, { projection: { _id: 0, path: 0 } })
      .toArray(),
  saveMany: async (db, assessmentCollection, assessmentDayData) =>
    await db.collection(assessmentCollection).insertMany(assessmentDayData),
  update: async (db, collection, query, assessmentDayDataAttributes) =>
    await db
      .collection(collection)
      .updateOne(query, { $set: assessmentDayDataAttributes }),
}

export default AssessmentDayDataModel
