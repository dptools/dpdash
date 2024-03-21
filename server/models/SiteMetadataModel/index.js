import { collections } from '../../utils/mongoCollections'

const SiteMetadataModel = {
  findOne: async (db, query) =>
    await db.collection(collections.metadata).findOne(query),
  upsert: async (db, query, metadataAttributes) =>
    await db
      .collection(collections.metadata)
      .findOneAndUpdate(query, metadataAttributes, {
        upsert: true,
        returnDocument: 'after',
      }),
}

export default SiteMetadataModel
