const CollectionsModel = {
  all: async (db, collection) =>
    await db.collection(collection).find({}).toArray(),
}

export default CollectionsModel
