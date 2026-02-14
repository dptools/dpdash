import { ObjectId } from 'mongodb'

import defaultUserConfig from '../../constants/defaultUserConfig'
import { collections } from '../../utils/mongoCollections'

const ConfigModel = {
  active: async (db, userId) =>
    await db
      .collection(collections.configs)
      .aggregate([
        {
          $match: {
            $or: [{ readers: userId }, { public: true }, { owner: userId }],
          },
        },
        {
          $match: { $or: [{ status: { $exists: false } }, { status: 1 }] },
        },
      ])
      .stream(),
  all: async (db, userId) =>
    await db
      .collection(collections.configs)
      .find({
        $or: [{ readers: userId }, { public: true }, { owner: userId }],
      })
      .stream(),
  destroy: async (db, configId) => {
    const { deletedCount } = await db
      .collection(collections.configs)
      .deleteOne({ _id: new ObjectId(configId) })

    if (deletedCount !== 1) {
      throw new Error('Unable to delete configuration')
    }
  },
  update: async (db, configId, configAttributes) => {
    const value = await db
      .collection(collections.configs)
      .findOneAndUpdate(
        { _id: new ObjectId(configId) },
        { $set: configAttributes },
        { returnOriginal: false, upsert: true, returnDocument: 'after' }
      )

    if (!value) {
      throw new Error('Could not update configuration')
    }

    return value
  },

  create: async (db, configAttributes) => {
    const { insertedId } = await db
      .collection(collections.configs)
      .insertOne(configAttributes)

    return await ConfigModel.findOne(db, { _id: insertedId })
  },
  findOne: async (db, configQuery) =>
    await db.collection(collections.configs).findOne(configQuery),
  withDefaults: (overrides = {}) => ({
    config: defaultUserConfig,
    name: 'default',
    type: 'matrix',
    created: new Date().toUTCString(),
    ...overrides,
  }),
}

export default ConfigModel
