import { MongoClient } from 'mongodb'

beforeAll(async () => {
  global.MONGO_INSTANCE = await MongoClient.connect(global.__MONGO_URI__)
})

afterAll(async () => {
  await global.MONGO_INSTANCE.close()
})
