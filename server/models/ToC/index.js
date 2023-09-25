import { collections } from '../../utils/mongoCollections'

const ToCModel = {
  upsert: async (db, query, dataFileAttributes) =>
    await db
      .collection(collections.toc)
      .findOneAndUpdate(query, { $set: dataFileAttributes }, { upsert: true }),
}

export default ToCModel
