import { ObjectId } from 'mongodb'
import { collections } from '../../utils/mongoCollections'

const id = '$_id'
const idKey = '$chart_id'
const chartId = 'chart_id'

const ChartsModel = {
  create: async (db, chartAttributes) =>
    await db.collection(collections.charts).insertOne(chartAttributes),
  all: async (db, user, queryParams) =>
    await db
      .collection(collections.charts)
      .aggregate(chartsListQuery(user, queryParams)),
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

const chartsListQuery = (user, queryParams) => {
  const { uid, favoriteCharts } = user
  const searchQuery = queryParams?.search
    ? {
        title: { $regex: queryParams.search, $options: 'i' },
        $or: [{ owner: uid }, { sharedWith: uid }, { public: true }],
      }
    : {
        $or: [{ owner: uid }, { sharedWith: uid }, { public: true }],
      }

  return [
    {
      $match: searchQuery,
    },
    { $set: { chart_id: { $toString: id } } },
    {
      $set: {
        favorite: { $in: [idKey, favoriteCharts || []] },
      },
    },
    { $unset: chartId },
    { $sort: { favorite: -1, title: 1 } },
  ]
}

export default ChartsModel
