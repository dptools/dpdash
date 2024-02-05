import SiteMetadataModel from '../../../models/SiteMetadataModel'
import { collections } from '../../../utils/mongoCollections'

const SiteMetadataController = {
  create: async (req, res) => {
    try {
      const { dataDb } = req.app.locals
      const { metadata, participants } = req.body
      const { study } = metadata

      participants.forEach((participant, i) => {
        participants[i].Consent = new Date(participant.Consent)
      })

      const studyMetadata = await SiteMetadataModel.findOne(dataDb, { study })
      if (!studyMetadata) {
        await SiteMetadataModel.upsert(
          dataDb,
          { study },
          { $set: { ...metadata, subjects: participants } }
        )
      } else {
        Promise.all(
          participants.map(async (participant) => {
            const isParticipantInSiteMetadata = await SiteMetadataModel.findOne(
              dataDb,
              { subjects: { $elemMatch: { subject: participant.subject } } }
            )
            if (!isParticipantInSiteMetadata) {
              await SiteMetadataModel.upsert(
                dataDb,
                { study },
                { $addToSet: { subjects: participant } }
              )
            } else {
              const updatedAttributes = Object.keys(participant).reduce(
                (attributes, key) => {
                  attributes[`subjects.$.${key}`] = participant[key]

                  return attributes
                },
                {}
              )
              await SiteMetadataModel.upsert(
                dataDb,
                { subjects: { $elemMatch: { subject: participant.subject } } },
                { $set: updatedAttributes }
              )
            }
          })
        )
      }

      return res.status(200).json({ data: 'Metadata imported successfully.' })
    } catch (error) {
      return res.status(401).json({ message: error.message })
    }
  },
  destroy: async (req, res) => {
    try {
      const { dataDb } = req.app.locals

      await dataDb.collection(collections.metadata).drop()

      return res.status(200).json({ data: 'Metadata collection restarted' })
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  },
}

export default SiteMetadataController
