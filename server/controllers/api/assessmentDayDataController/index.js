import dayjs from 'dayjs'
import AssessmentDayDataModel from '../../../models/AssessmentDayDataModel'
import deepEqual from 'deep-equal'
import ToCModel from '../../../models/ToC'
import SiteMetadataModel from '../../../models/SiteMetadataModel'

const AssessmentDayDataController = {
  create: async (req, res) => {
    try {
      const { dataDb } = req.app.locals
      const updatedParticipants = []

      const { metadata, subject_assessments } = req.body

      if (!metadata || !subject_assessments.length)
        return res.status(400).json({ message: 'Nothing to import' })

      const { assessment, subject, collection, study } = metadata
      const query = {
        assessment,
        subject,
      }
      const studyMetadata = await SiteMetadataModel.findOne(dataDb, {
        study,
      })
      const storedDataCursor = await AssessmentDayDataModel.all(
        dataDb,
        collection
      )
      const dataStream = storedDataCursor.stream()

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

      dataStream.on('end', async () => {
        await ToCModel.upsert(dataDb, query, metadata)

        if (subject_assessments.length) {
          await AssessmentDayDataModel.createMany(
            dataDb,
            collection,
            subject_assessments
          )
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
            if (!studyMetadata) {
              await SiteMetadataModel.upsert(
                dataDb,
                { study },
                {
                  $set: {
                    study,
                    subjects: [
                      {
                        study,
                        subject,
                        Active: 1,
                        synced: dayjs().toISOString(),
                      },
                    ],
                  },
                }
              )
            } else {
              await SiteMetadataModel.upsert(
                dataDb,
                { subjects: { $elemMatch: { subject } } },
                { $set: { 'subjects.$.synced': dayjs().toISOString() } }
              )
            }
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
