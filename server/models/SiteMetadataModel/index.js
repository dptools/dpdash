import { collections } from '../../utils/mongoCollections'

const SiteMetadataModel = {
  upsert: async (db, query, metadataAttributes, metadataParticipants) =>
    await db.collection(collections.metadata).findOneAndUpdate(
      query,
      {
        $set: {
          ...metadataAttributes,
        },
        $addToSet: { subjects: { $each: metadataParticipants } },
      },
      { upsert: true }
    ),
}

export default SiteMetadataModel
