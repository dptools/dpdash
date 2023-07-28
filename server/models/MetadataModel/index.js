import { collections } from '../../utils/mongoCollections'

const MetadataModel = {
  findOne: async (db, metadataAttributes) =>
    await db.collection(collections.metadata).findOne(metadataAttributes),
}

export default MetadataModel
