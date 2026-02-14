import { collections } from '../../utils/mongoCollections'

const queryOptions = {
  upsert: true,
  returnDocument: 'after',
}
const SiteMetadataModel = {
  findOne: async (db, query) =>
    await db.collection(collections.metadata).findOne(query),
  upsert$Set: async (db, query, setAttributes) =>
    await db.collection(collections.metadata).findOneAndUpdate(
      query,
      {
        $set: setAttributes,
      },
      queryOptions
    ),
  upsert$addToSet: async (db, query, addToSetAttributes) =>
    await db.collection(collections.metadata).findOneAndUpdate(
      query,
      {
        $addToSet: addToSetAttributes,
      },
      queryOptions
    ),
}

export default SiteMetadataModel
