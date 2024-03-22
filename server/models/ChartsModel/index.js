import { ObjectId } from 'mongodb'
import { collections } from '../../utils/mongoCollections'
import { ASC } from '../../constants'

const id = '$_id'
const idKey = '$chart_id'
const updatedAt = 'updatedAt'
const $updatedAt = '$updatedAt'
const today = () => new Date()

const ChartsModel = {
  create: async (db, chartAttributes) =>
    await db.collection(collections.charts).insertOne({
      ...chartAttributes,
      updatedAt: today(),
      createdAt: today(),
    }),
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
        { $set: { ...chartAttributes, updatedAt: today() } },
        { returnOriginal: false, upsert: true, returnDocument: 'after' }
      ),
}

export const chartsListQuery = (user, queryParams) => {
  const { uid, favoriteCharts } = user
  const { sortBy, sortDirection } = queryParams
  const direction = sortDirection === ASC ? 1 : -1
  const sort =
    sortBy === updatedAt
      ? [
          {
            $addFields: {
              date: { $dateFromString: { dateString: $updatedAt } },
            },
          },
          { $sort: { favorite: -1, date: direction } },
        ]
      : [{ $sort: { favorite: -1, [sortBy]: direction } }]
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
    { $addFields: { chart_id: { $toString: id } } },
    {
      $addFields: {
        favorite: { $in: [idKey, favoriteCharts || []] },
      },
    },
    ...sort,
  ]
}

export default ChartsModel
