import SiteMetadataModel from '../../models/SiteMetadataModel'

const SiteMetadataController = {
  create: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { metadata, participants } = req.body
      const { study } = metadata

      await SiteMetadataModel.upsert(appDb, { study }, metadata, participants)

      return res.status(200).json({ data: 'Metadata imported successfully.' })
    } catch (error) {
      return res.status(401).json({ message: error.message })
    }
  },
}

export default SiteMetadataController
