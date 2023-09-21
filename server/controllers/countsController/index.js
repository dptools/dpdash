import ToCModel from '../../models/ToCModel'
import UserModel from '../../models/UserModel'
import { STUDIES_TO_OMIT } from '../../constants'
import MetadataModel from '../../models/MetadataModel'

const CountsController = {
  index: async (req, res) => {
    try {
      const { appDb, dataDb } = req.app.locals
      const user = await UserModel.findOne(appDb, { uid: req.user })
      const sites = user.access.filter(
        (site) => !STUDIES_TO_OMIT.includes(site)
      )
      const maxDayCursor = await ToCModel.lastByEndDay(dataDb, sites)
      const participantsCursor = await MetadataModel.subjectCount(dataDb, sites)
      const counts = {
        numOfSites: sites.length.toString(),
      }

      const isParticipantsDataAvailable = await participantsCursor.hasNext()
      const isMaxDayDataAvailable = await maxDayCursor.hasNext()

      if (isMaxDayDataAvailable) {
        const doc = await maxDayCursor.next()
        counts.maxDay = doc.end
      }

      if (isParticipantsDataAvailable) {
        const doc = await participantsCursor.next()
        counts.numOfParticipants = doc.totalParticipants
      }

      return res.status(200).json({ data: counts })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
}

export default CountsController
