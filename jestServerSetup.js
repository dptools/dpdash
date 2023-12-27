import { MongoClient } from 'mongodb'

beforeAll(async () => {
  global.MONGO_INSTANCE = await MongoClient.connect(global.__MONGO_URI__, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

afterAll(async () => {
  await global.MONGO_INSTANCE.close()
})
