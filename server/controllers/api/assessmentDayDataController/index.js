import AssessmentDayDataModel from '../../../models/AssessmentDayDataModel'
import deepEqual from 'deep-equal'
import ToCModel from '../../../models/ToC'

const AssessmentDayDataController = {
  create: async (req, res) => {
    try {
      const { dataDb } = req.app.locals
      const updatedParticipants = []

      const { metadata, subject_assessments } = req.body

      if (!metadata || !subject_assessments.length)
        return res.status(400).json({ message: 'Nothing to import' })

      const { assessment, subject, collection } = metadata
      const query = {
        assessment,
        subject,
      }
      const storeDataCursor = await AssessmentDayDataModel.all(
        dataDb,
        collection
      )
      const dataStream = storeDataCursor.stream()

      dataStream.on('data', (doc) => {
        const { day } = doc
        const dayDataIndex = subject_assessments.findIndex(
          (data) => data.day === day
        )
        if (dayDataIndex !== -1) {
          const removedDocument = subject_assessments.splice(dayDataIndex, 1)

          if (!deepEqual(doc, removedDocument[0])) {
            const { _id, ...rest } = removedDocument[0]
            updatedParticipants.push(rest)
          }
        }
      })

      dataStream.on('end', () => {
        ToCModel.upsert(dataDb, query, metadata)
          .then((data) => console.log(data))
          .catch((err) => console.error(err))

        if (subject_assessments.length) {
          AssessmentDayDataModel.saveMany(
            dataDb,
            collection,
            subject_assessments
          )
            .then(() => console.log('inserting new data'))
            .catch((error) => {
              throw new Error(error)
            })
        }
        Promise.all(
          updatedParticipants.map(async (participant) => {
            const { day } = participant
            await AssessmentDayDataModel.update(
              dataDb,
              collection,
              { day },
              participant
            )
          })
        )
      })

      return res.status(200).json({ data: 'Imported successfully' })
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  },
}

export default AssessmentDayDataController
