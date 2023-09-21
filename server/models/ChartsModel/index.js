import { ObjectId } from 'mongodb'
import { collections } from '../../utils/mongoCollections'

const ChartsModel = {
  create: async (db, chartAttributes) =>
    await db.collection(collections.charts).insertOne(chartAttributes),
  index: async (db, query) =>
    await db.collection(collections.charts).find(query),
  destroy: async (db, chart_id) => {
    const { deletedCount } = await db
      .collection(collections.charts)
      .deleteOne({ _id: new ObjectId(chart_id) })

    if (deletedCount !== 1) {
      throw new Error('Unable to delete chart')
    }
  },
  show: async (db, query) =>
    await db.collection(collections.charts).findOne(query),
  update: async (db, query, chartAttributes) =>
    await db
      .collection(collections.charts)
      .findOneAndUpdate(
        query,
        { $set: chartAttributes },
        { returnOriginal: false, upsert: true, returnDocument: 'after' }
      ),
}

export default ChartsModel
