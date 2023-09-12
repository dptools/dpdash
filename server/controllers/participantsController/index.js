import ParticipantsModel from '../../models/ParticipantsModel'
import UserModel from '../../models/UserModel'

const ParticipantsController = {
  index: async (req, res) => {
    try {
      const { dataDb, appDb } = req.app.locals
      const user = await UserModel.findOne(appDb, { uid: req.user })
      const participants = await ParticipantsModel.index(dataDb, user.access)

      return res.status(200).json({ data: participants })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
}

export default ParticipantsController
