import defaultUserConfig from '../../configs/defaultUserConfig'
import { collections } from '../../utils/mongoCollections'

const ConfigModel = {
  withDefaults: (overrides = {}) => ({
    config: defaultUserConfig,
    name: 'default',
    type: 'matrix',
    created: new Date().toUTCString(),
    ...overrides,
  }),
  save: async (db, configAttributes) => {
    const config = ConfigModel.withDefaults(configAttributes)

    return await db.collection(collections.configs).insertOne(config)
  },
  find: async (db, uid) => {
    return await db.collection(collections.configs).findOne({ owner: uid })
  },
}

export default ConfigModel
