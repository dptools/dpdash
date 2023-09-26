import qs from 'qs'
import { DEFAULT_PARTICIPANTS_SORT } from '../../constants'
import ParticipantsModel from '../../models/ParticipantsModel'
import UserModel from '../../models/UserModel'

const ParticipantsController = {
  index: async (req, res) => {
    try {
      const { dataDb, appDb } = req.app.locals
      const parsedQueryParams = Object.keys(req.query).length ? req.query : DEFAULT_PARTICIPANTS_SORT
      const user = await UserModel.findOne(appDb, { uid: req.user })
      const participants = await ParticipantsModel.index(
        dataDb,
        user,
        parsedQueryParams
      )

      return res.status(200).json({ data: participants })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
}

export default ParticipantsController
