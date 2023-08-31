import { MongoClient } from 'mongodb';

let connection
beforeAll(async () => {
  process.env.MONGODB_URI = global.__MONGO_URI__

  connection = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  global.appDb = await connection.db('dpdmongo');
  global.dataDb = await connection.db('dpdata');
});

afterEach(async () => {
  await Promise.all((await global.appDb.listCollections().toArray()).map(async (collection) => {
    return global.appDb.collection(collection.name).drop()
  }))
  await Promise.all((await global.dataDb.listCollections().toArray()).map(async (collection) => {
    return global.dataDb.collection(collection.name).drop()
  }))
})

afterAll(async () => {
  await connection.close()
})
