const { MongoClient } = require('mongodb')

const COLLECTION_NAME = 'assessmentSubjectDayData'

export async function migrateAssessmentSubjectDayData() {  
  const mongoConnection = await MongoClient.connect(process.env.MONGODB_URI, {
    ssl: process.env.NODE_ENV === 'production',
    useNewUrlParser: true,
  })

  const appDb = mongoConnection.db('dpdmongo')
  const db = mongoConnection.db('dpdata')
  const tocCollection = db.collection('toc')

  const collectionSet = new Set()
  const tocCursor = await tocCollection.find({})

  while (await tocCursor.hasNext()) {
    const assessmentSubjectDays = []
    const toc = await tocCursor.next()
    
    toc['toc_id'] = toc['_id']
    delete toc['_id']
    toc['toc_mtime'] = toc['mtime']
    delete toc['mtime']
    toc['toc_path'] = toc['path']
    delete toc['path']

    if (collectionSet.has(toc.collection)) {
      continue
    }

    const dayData = await db.collection(toc.collection).find({}).toArray()
    collectionSet.add(toc.collection)

    new Set(dayData.map( d => Object.keys(d)).reduce((acc, keys) => acc.concat(keys), [])).forEach((key) => {
      if (toc[key] !== undefined  && dayData[0][key] !== toc[key]) {
        mongoConnection.close()
        throw new Error(`Prevented write due to overwritten data in ${toc.collection}: ${key}`)
      }
    })
    
    for (const day of dayData) {
      day['legacy_id'] = day['_id']
      delete day['_id']

      const assessmentSubjectDay = {
        ...toc,
        ...day,
      }
      assessmentSubjectDays.push(assessmentSubjectDay)      
    }

    const collection = appDb.collection(COLLECTION_NAME)
    
    const assessmentSubjectDaysToSkip = await collection.find({ legacy_id: {
      $in: assessmentSubjectDays.map( d => d.legacy_id)
    }}).toArray()

    const assessmentSubjectDaysToAdd = assessmentSubjectDays.filter(d => !assessmentSubjectDaysToSkip.map(d => d.legacy_id).includes(d.legacy_id))

    if (assessmentSubjectDaysToAdd.length > 0) {
      await collection.insertMany(assessmentSubjectDaysToAdd)
    }
  }

  return mongoConnection
}

if (process.env.NODE_ENV !== 'test') {
  migrateAssessmentSubjectDayData()
    .then(async (mongoConnection) => {
      console.log('Done')
      await mongoConnection.close()
      process.exit(0)
    }).catch(async (err) => {
      console.error(err)
      process.exit(1)
    })
  }
