import SiteMetadataModel from '../../../models/SiteMetadataModel'
import { collections } from '../../../utils/mongoCollections'

const SiteMetadataController = {
  create: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { metadata, participants } = req.body
      const { study } = metadata

      participants.forEach((participant, i) => {
        participants[i].Consent = new Date(participant.Consent)
      })

      const studyMetadata = await SiteMetadataModel.findOne(appDb, { study })
      if (!studyMetadata) {
        await SiteMetadataModel.upsert(
          appDb,
          { study },
          { $set: { ...metadata, participants } }
        )
      } else {
        Promise.all(
          participants.map(async (participant) => {
            const isParticipantInSiteMetadata = await SiteMetadataModel.findOne(
              appDb,
              {
                participants: {
                  $elemMatch: { participant: participant.participant },
                },
              }
            )
            if (!isParticipantInSiteMetadata) {
              await SiteMetadataModel.upsert(
                appDb,
                { study },
                { $addToSet: { participants: participant } }
              )
            } else {
              const updatedAttributes = Object.keys(participant).reduce(
                (attributes, key) => {
                  attributes[`participants.$.${key}`] = participant[key]

                  return attributes
                },
                {}
              )
              await SiteMetadataModel.upsert(
                appDb,
                {
                  participants: {
                    $elemMatch: { participant: participant.participant },
                  },
                },
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
      const { appDb } = req.app.locals

      await appDb.collection(collections.metadata).drop()

      return res.status(200).json({ data: 'Metadata collection restarted' })
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  },
}

export default SiteMetadataController
