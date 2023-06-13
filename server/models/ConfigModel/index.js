import { ObjectId } from 'mongodb'
import defaultUserConfig from '../../configs/defaultUserConfig'
import { collections } from '../../utils/mongoCollections'

const ConfigModel = {
  destroy: async (db, configId) => {
    return await db
      .collection(collections.configs)
      .deleteOne({ _id: new ObjectId(configId) })
  },
  update: async (db, configId, configAttributes) => {
    return await db
      .collection(collections.configs)
      .findOneAndUpdate(
        { _id: new ObjectId(configId) },
        { $set: configAttributes },
        { returnOriginal: false }
      )
  },
  index: async (db, userId) => {
    return await db
      .collection(collections.configs)
      .aggregate(loadAllConfigurationsMongoQuery(userId))
      .toArray()
  },
  save: async (db, configAttributes) => {
    const config = ConfigModel.withDefaults(configAttributes)

    return await db.collection(collections.configs).insertOne(config)
  },
  findOne: async (db, userId) =>
    await db.collection(collections.configs).findOne({ owner: userId }),
  withDefaults: (overrides = {}) => ({
    config: defaultUserConfig,
    name: 'default',
    type: 'matrix',
    created: new Date().toUTCString(),
    ...overrides,
  }),
}

const loadAllConfigurationsMongoQuery = (userId) => {
  const users = 'users'
  const $owner = '$owner'
  const $uid = '$uid'
  const $$owner = '$$owner'
  const resultPropertyName = 'ownerUser'
  const $ownerUser = '$ownerUser'
  const $display_name = '$display_name'

  return [
    { $match: { readers: userId } },
    {
      $lookup: {
        from: users,
        let: { owner: $owner },
        pipeline: [
          {
            $match: {
              $expr: { $eq: [$$owner, $uid] },
            },
          },
          {
            $project: {
              icon: 1,
              uid: 1,
              name: $display_name,
              _id: 0,
            },
          },
        ],
        as: resultPropertyName,
      },
    },
    { $unwind: $ownerUser },
  ]
}

export default ConfigModel
