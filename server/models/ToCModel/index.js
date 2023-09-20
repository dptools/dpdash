import { collections } from '../../utils/mongoCollections'

const ToCModel = {
  lastByEndDay: async (db, sites) =>
    await db
      .collection(collections.toc)
      .find({ study: { $in: sites } })
      .sort({ end: -1 })
      .limit(1),
}

export default ToCModel
