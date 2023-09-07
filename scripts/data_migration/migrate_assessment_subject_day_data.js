const { MongoClient } = require('mongodb')

const DAY_DATA_COLLECTION = 'assessmentSubjectDayData'
const ASSESSMENT_RANGE_COLLECTION = 'assessmentSubjectRange'

async function migrateAssessmentSubjectDayData() {  
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

    if (collectionSet.has(toc.collection)) {
      continue
    }

    const dayData = await db.collection(toc.collection).find({}).toArray()
    collectionSet.add(toc.collection)
    
    for (const day of dayData) {
      day['legacy_id'] = day['_id']
      delete day['_id']
      const { study, subject, assessment, collection, units, time_units } = toc
      const assessmentSubjectDay = {
        ...day,
        study,
        subject,
        assessment,
        collection,
        units,
        time_units
      }
      assessmentSubjectDays.push(assessmentSubjectDay)      
    }

    const collection = appDb.collection(DAY_DATA_COLLECTION)
    
    const assessmentSubjectDaysToSkip = await collection.find({ legacy_id: {
      $in: assessmentSubjectDays.map( d => d.legacy_id)
    }}).toArray()

    const assessmentSubjectDaysToAdd = assessmentSubjectDays.filter(d => !assessmentSubjectDaysToSkip.map(d => d.legacy_id).includes(d.legacy_id))

    if (assessmentSubjectDaysToAdd.length > 0) {
      await collection.insertMany(assessmentSubjectDaysToAdd)
    }

    await appDb.collection(ASSESSMENT_RANGE_COLLECTION).insertOne({
      legacy_id: toc._id,
      study: toc.study,
      subject: toc.subject,
      assessment: toc.assessment,
      units: toc.units,
      start: toc.start,
      end: toc.end,
      collection: toc.collection,
      time_units: toc.time_units,
      time_start: toc.time_start,
      time_end: toc.time_end,
      uid: toc.uid,
      gid: toc.gid,
      mode: toc.mode,
      role: toc.role,
      updated: toc.updated,
      dirty: toc.dirty,
      synced: toc.synced,
      fileMetadata: {
        extension: toc.extension,
        glob: toc.glob,
        path: toc.path,
        filetype: toc.filetype,
        encoding: toc.encoding,
        basename: toc.basename,
        dirname: toc.dirname,
        mtime: toc.mtime,
        size: toc.size,
      }
    })
  }

  return mongoConnection
}

module.exports = { migrateAssessmentSubjectDayData }

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
